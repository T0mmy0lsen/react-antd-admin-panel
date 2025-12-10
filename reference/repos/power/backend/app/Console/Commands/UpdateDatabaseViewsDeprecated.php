<?php

namespace App\Console\Commands;

use App\Models\FormularCreator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateDatabaseViewsDeprecated extends Command
{
    protected $signature = 'app:update-database-views-deprecated';
    protected $description = 'Update database views';

    public function handle()
    {
        $formularCreators = FormularCreator::all();
        foreach ($formularCreators as $formularCreator) {
            $this->updateOrViewCreate($formularCreator);
        }
    }

    private function updateOrViewCreate($formularCreator)
    {
        $formularCreator = FormularCreator::where('id', $formularCreator->id)->with([
            'elements',
            'elements.valueSet',
            'elements.valueSet.headers',
        ])->first();

        $selection = ['formular_creator_id', 'formular_id'];
        $uniqueValueSetIds = []; // Array to keep track of unique value_set_ids
        $uniqueElements = []; // Array to keep the elements with unique value_set_id
        $CTEJoins = [];
        $viewName = "view_for_formular_creator_" . $formularCreator->id;
        $elementQueries = [];
        $i = 0;

        foreach ($formularCreator->elements as $element) {
            if (!in_array($element->value_set_id, $uniqueValueSetIds) && $element->value_set_id != 0) {
                // If the value_set_id is not in the array, add it
                $uniqueValueSetIds[] = $element->value_set_id;
                $uniqueElements[] = $element; // Add the unique element to the array
            }
        }

        foreach ($uniqueElements as $element)
        {
            if ($element->valueSet)
            {
                $dynamicNames = [];
                foreach ($element->valueSet->headers as $header) {
                    $dynamicNames[] = $header->key;
                }

                // Construct the SQL query with dynamic column names
                $dynamicSelects = [];
                foreach ($dynamicNames as $index => $name) {
                    $name = "{$name}_{$element->id}}";
                    $name = strtolower($name);
                    $name = str_replace(' ', '_', $name);
                    $name = preg_replace('/[^a-z0-9_]/', '', $name);
                    $name = substr($name, -32, 32);
                    $dynamicSelects[] = "JSON_UNQUOTE(JSON_EXTRACT(data, '$[{$index}].value')) AS `{$name}`";
                }

                $dynamicSQL[] = "data_{$element->value_set_id} AS (SELECT id, value_set_id, value, " . implode(", ", $dynamicSelects) . " FROM laravel.`values` WHERE JSON_VALID(data) AND value_set_id = {$element->valueSet->id})";
            }
        }

        foreach ($formularCreator->elements as $element)
        {
            // Transform the name: lowercase, replace spaces with underscores, remove special chars
            $name = strtolower($element->name);
            $name = str_replace(' ', '_', $name);
            $name = preg_replace('/[^a-z0-9_]/', '', $name);
            $name = $name . '_' . $element->id;
            $name = substr($name, -32, 32);

            $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN fv.value END) AS `{$name}`";
            $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN fv.value_id END) AS `{$name}_id`";

            if ($element->value_set_id != 0) {
                $CTEJoins[] = "LEFT JOIN data_{$element->value_set_id} as data_{$i} ON data_{$i}.id = data_collected.{$name}_id";
                $selection[] = $name;
                if ($element->valueSet)
                {
                    $dynamicNames = [];
                    foreach ($element->valueSet->headers as $header) {
                        $dynamicNames[] = $header->key;
                    }

                    foreach ($dynamicNames as $index => $sub_name) {
                        $sub_name = "{$sub_name}_{$element->id}";
                        $sub_name = strtolower($sub_name);
                        $sub_name = str_replace(' ', '_', $sub_name);
                        $sub_name = preg_replace('/[^a-z0-9_]/', '', $sub_name);
                        if (!str_contains($sub_name, 'label')) {
                            $selection[] = "data_{$i}.{$sub_name} AS `{$name}_{$sub_name}`";
                        }
                    }
                }
            }
            $i++;
        }

        $dynamicSQLString = implode(", ", $dynamicSQL);
        $selection = implode(", ", $selection);
        $CTEJoinsString = implode("\n", $CTEJoins);
        $elementQueriesString = implode(", ", $elementQueries);

        $query = "
            CREATE OR REPLACE VIEW {$viewName} AS

            WITH

            {$dynamicSQLString},

            data_collected AS (SELECT
                fc.id AS formular_creator_id,
                f.id AS formular_id,
                {$elementQueriesString}
            FROM
                formular_creators fc
            LEFT JOIN
                formulars f ON fc.id = f.formular_creator_id
            LEFT JOIN
                formular_values fv ON fv.formular_id = f.id
            GROUP BY f.id, fc.id)

            SELECT {$selection} FROM data_collected
                {$CTEJoinsString}
            WHERE
                formular_creator_id = {$formularCreator->id}";

        print_r($query);
        // DB::statement($query);
    }
}
