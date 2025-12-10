<?php

namespace App\Console\Commands;

use App\Models\Configs;
use App\Models\Formular;
use App\Models\FormularCreator;
use App\Models\FormularCreatorConfigs;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FormularDeleteIdle extends Command
{
    protected $signature = 'formular:delete-idle';
    protected $description = 'Delete formulars where its updated at date is past now() + value';

    public function handle()
    {
        $configDeleteIdle = Configs::where('config', 'deleteIdle')->first();

        if (!$configDeleteIdle) {
            $this->info('Config deleteIdle not found.');
            return;
        }

        $formularsCreators = FormularCreator::all();

        foreach ($formularsCreators as $formularsCreator)
        {
            $configValue = FormularCreatorConfigs::where('formular_creator_id', $formularsCreator->id)
                ->where('config_id', $configDeleteIdle->id)
                ->first();

            $value = $configValue?->inputs[0]->value->getValue();

            if ($value) {
                foreach ($formularsCreator->formulars as $formular) {
                    $firstFormularValue = $formular->values->first();
                    if ($firstFormularValue->updated_at->addMinutes($value)->lessThan(Carbon::now())) {
                        $formular->delete();
                    }
                }
            }
        }

        $this->info('Command executed successfully.');
    }
}
