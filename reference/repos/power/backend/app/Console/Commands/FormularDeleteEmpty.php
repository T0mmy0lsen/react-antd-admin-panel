<?php

namespace App\Console\Commands;

use App\Models\FormularCreator;
use App\Models\FormularCreatorConfigs;
use App\Models\Configs;
use Illuminate\Console\Command;
use Carbon\Carbon;

class FormularDeleteEmpty extends Command
{
    protected $signature = 'formular:delete-empty';
    protected $description = 'Delete formulars where its created at date is past now() + value';

    public function handle()
    {
        $configDeleteEmpty = Configs::where('config', 'deleteEmpty')->first();

        if (!$configDeleteEmpty) {
            $this->info('Config deleteEmpty not found.');
            return;
        }

        $formularsCreators = FormularCreator::all();

        foreach ($formularsCreators as $formularsCreator) {
            $configValue = FormularCreatorConfigs::where('formular_creator_id', $formularsCreator->id)
                ->where('config_id', $configDeleteEmpty->id)
                ->first();

            $value = $configValue ? $configValue->inputs[0]->value->valueInt->value : null;

            if ($value) {
                foreach ($formularsCreator->formulars as $formular)
                {
                    if ($formular->created_at->addMinutes($value)->lessThan(Carbon::now())) {
                        $formular->delete();
                    }
                }
            }
        }

        $this->info('Command executed successfully.');
    }
}
