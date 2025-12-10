<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ImportController;
use Illuminate\Http\Request;

class ImportDefaultUsers extends Command
{
    protected $signature = 'app:import-default-users';

    protected $description = 'Import default users and assign roles';

    public function handle()
    {
        $controller = new ImportController();

        // Define your default users and roles here
        $defaultUsers = [
            [
                 'email' => 'tommy@live.dk',
                 'name' => 'Tommy Olsen',
                 'roles' => [
                     ['area' => 'Odense', 'role' => 'Reader'],
                     ['area' => 'Aalborg', 'role' => 'Reader'],
                 ]
            ],
        ];

        $request = new Request();
        $request->merge(['users' => $defaultUsers]);

        $controller->users($request);

        $this->info('Default users imported successfully');
    }
}
