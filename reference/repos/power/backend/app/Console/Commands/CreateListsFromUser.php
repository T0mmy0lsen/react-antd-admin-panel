<?php

namespace App\Console\Commands;

use App\Models\Area;
use App\Models\User;
use App\Models\Value;
use App\Models\ValueOption;
use App\Models\ValueSets;
use App\Models\ValueString;
use Illuminate\Console\Command;

class CreateListsFromUser extends Command
{
    protected $signature = 'app:create-lists-from-user';
    protected $description = 'Create ValueSet and values from Users';

    public function handle()
    {
        $valueSet = ValueSets::updateOrCreate([
            'name' => 'Brugere'
        ], [
            'type' => 'Option',
            'description' => 'Brugere fra systemet'
        ]);

        $valueSet->headers()->updateOrCreate(['key' => 'id', 'value' => 'id']);
        $valueSet->headers()->updateOrCreate(['key' => 'label', 'value' => 'navn']);
        $valueSet->headers()->updateOrCreate(['key' => 'email', 'value' => 'email']);

        $users = User::all();

        foreach ($users as $user)
        {
            // Find an existing value with the same user id
            $existingValue = ValueOption::where('value_set_id', $valueSet->id)
                ->whereHas('fields', function ($query) use ($user) {
                    $query->where('key', 'id')->where('value', $user->id);
                })
                ->first();

            if ($existingValue) {
                $existingValue->update([
                    'value' => $user->name,
                ]);
            } else {
                $existingValue = ValueOption::create([
                    'value_set_id' => $valueSet->id,
                    'value' => $user->name,
                ]);
            }

            $existingValue->fields()->updateOrCreate(['key' => 'id'], ['value' => $user->id]);
            $existingValue->fields()->updateOrCreate(['key' => 'label'], ['value' => $user->name]);
            $existingValue->fields()->updateOrCreate(['key' => 'email'], ['value' => $user->email]);
        }
    }

}
