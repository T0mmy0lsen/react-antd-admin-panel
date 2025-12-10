<?php

namespace App\Console\Commands;

use App\Models\Area;
use App\Models\Value;
use App\Models\ValueOption;
use App\Models\ValueSets;
use Illuminate\Console\Command;

class CreateListsFromArea extends Command
{
    protected $signature = 'app:create-lists-from-area';
    protected $description = 'Create ValueSet and values from Areas';

    public function handle()
    {
        // The Area is a ValueSet. The Values are the Areas.
        $valueSet = ValueSets::updateOrCreate([
            'name' => 'Område'
        ], [
            'type' => 'Option',
            'description' => 'Områder fra systemet'
        ]);
        $valueSet->headers()->updateOrCreate(['key' => 'id'], ['value' => 'id']);
        $valueSet->headers()->updateOrCreate(['key' => 'label'], ['value' => 'label']);
        $valueSet->headers()->updateOrCreate(['key' => 'description'], ['value' => 'description']);
        $valueSet->headers()->updateOrCreate(['key' => 'parent_area_id'], ['value' => 'parent']);

        $areas = Area::all();

        foreach ($areas as $area) {
            // Find an existing value with the same area_id
            $existingValue = ValueOption::where('value_set_id', $valueSet->id)
                ->whereHas('fields', function ($query) use ($area) {
                    $query->where('key', 'id')->where('value', $area->id);
                })
                ->first();

            if ($existingValue) {
                $existingValue->update(['value' => $area->name]);
            } else {
                $existingValue = ValueOption::create([
                    'value_set_id' => $valueSet->id,
                    'value' => $area->name
                ]);
            }

            $existingValue->fields()->updateOrCreate(['key' => 'id'], ['value' => $area->id]);
            $existingValue->fields()->updateOrCreate(['key' => 'label'], ['value' => $area->name]);
            $existingValue->fields()->updateOrCreate(['key' => 'description'], ['value' => $area->description]);
            $existingValue->fields()->updateOrCreate(['key' => 'parent_area_id'], ['value' => $area->parent_area_id]);
        }
    }
}
