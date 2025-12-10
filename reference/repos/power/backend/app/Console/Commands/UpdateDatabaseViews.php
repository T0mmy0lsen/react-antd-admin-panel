<?php

namespace App\Console\Commands;

use App\Models\FormularCreator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateDatabaseViews extends Command
{
    protected $signature = 'app:update-database-views';
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

        $selection = ['fc.id AS formular_creator_id', 'formular_id'];
        $viewName = "view_for_formular_creator_" . $formularCreator->id;
        $elementQueries = [];
        $i = 0;

        foreach ($formularCreator->elements as $element)
        {
            // Transform the name: lowercase, replace spaces with underscores, remove special chars
            $name = strtolower($element->name);
            $name = str_replace(' ', '_', $name);
            $name = preg_replace('/[^a-z0-9_]/', '', $name);
            $name = $name . '_' . $element->id;
            $name = substr($name, -32, 32);

            if ($element->value_set_id) {
                switch ($element->valueSet->type) {
                    case 'Datetime':
                        $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN vd.value END) AS `{$name}`";
                        break;
                    case 'Boolean':
                        $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN vbs.value END) AS `{$name}`";
                        break;
                    case 'Integer':
                        $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN vb.value END) AS `{$name}`";
                        break;
                    case 'String':
                    case 'Text':
                        $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN vs.value END) AS `{$name}`";
                        break;
                    case 'Option':
                        $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} THEN vo.value END) AS `{$name}`";
                        foreach ($element->valueSet->headers as $header) {
                            if ($header->key == 'label') continue;
                            $headerName = strtolower($header->key);
                            $headerName = str_replace(' ', '_', $headerName);
                            $headerName = preg_replace('/[^a-z0-9_]/', '', $headerName);
                            $headerName = substr($headerName, -32, 32);
                            $elementQueries[] = "MAX(CASE WHEN fv.formular_creator_element_id = {$element->id} AND vof.key = \"{$header->key}\" THEN vof.value END) AS `{$name}_{$headerName}`";
                        }
                        break;
                }
            }
        }

        $selection = implode(",\n", $elementQueries);

        $query = "
            CREATE OR REPLACE VIEW {$viewName} AS

            SELECT
                {$selection}
            FROM formular_creators fc
                left join formulars f on fc.id = f.formular_creator_id
                left join formular_values fv on fv.formular_id = f.id
                left join `values` v on v.id = fv.value_id
                left join value_datetimes vd on vd.id = v.value_datetime_id
                left join value_booleans vbs on vbs.id = v.value_boolean_id
                left join value_ints vb on vb.id = v.value_int_id
                left join value_strings vs on vs.id = v.value_text_id
                left join value_options vo on vo.id = v.value_option_id
                left join value_option_fields vof on vof.value_option_id = vo.id
            WHERE
                fc.id = {$formularCreator->id}
            GROUP BY f.id, fc.id";

        DB::statement($query);
    }
}
