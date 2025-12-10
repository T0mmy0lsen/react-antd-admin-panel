<?php

namespace App\Console\Commands;

use App\Models\Area;
use App\Models\User;
use App\Models\Value;
use App\Models\ValueOption;
use App\Models\ValueSets;
use App\Models\ValueString;
use Illuminate\Console\Command;

class CreateListsFromLists extends Command
{
    protected $signature = 'app:create-lists-from-lists';
    protected $description = 'Create ValueSet and values from ValueSets';

    public function handle()
    {
        $valueSet = ValueSets::updateOrCreate([
            'name' => 'ValueSets'
        ], [
            'type' => 'Option',
            'description' => 'ValueSets in the system'
        ]);

        $valueSet->headers()->updateOrCreate(['key' => 'id', 'value' => 'id']);
        $valueSet->headers()->updateOrCreate(['key' => 'label', 'value' => 'name']);

        $valueSets = ValueSets::all();

        foreach ($valueSets as $valueSetOption)
        {
            // Find an existing value with the same valueSet id
            $existingValue = ValueOption::where('value_set_id', $valueSet->id)
                ->whereHas('fields', function ($query) use ($valueSetOption) {
                    $query->where('key', 'id')->where('value', $valueSetOption->id);
                })
                ->first();

            if ($existingValue) {
                $existingValue->update([
                    'description' => $valueSetOption->name,
                ]);
            } else {
                $existingValue = ValueOption::create([
                    'value_set_id' => $valueSet->id,
                    'value' => $valueSetOption->name,
                    'description' => $valueSetOption->description,
                ]);
            }

            $existingValue->fields()->updateOrCreate(['key' => 'id'], ['value' => $valueSetOption->id]);
            $existingValue->fields()->updateOrCreate(['key' => 'name'], ['value' => $valueSetOption->name]);
            $existingValue->fields()->updateOrCreate(['key' => 'label'], ['value' => $valueSetOption->name]);
            $existingValue->fields()->updateOrCreate(['key' => 'description'], ['value' => $valueSetOption->description]);
        }
    }

}
