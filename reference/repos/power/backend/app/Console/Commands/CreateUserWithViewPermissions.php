<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class CreateUserWithViewPermissions extends Command
{
    protected $signature = 'app:create-user-view-permissions';
    protected $description = 'Create user with view permissions';

    public function handle()
    {
        $username = env('DB_VIEW_USERNAME');
        $password = env('DB_VIEW_PASSWORD');

        try {
            DB::statement("CREATE USER '{$username}'@'%' IDENTIFIED BY '{$password}';");
            DB::statement("FLUSH PRIVILEGES;");
        } catch (QueryException $e) {
            if ($e->getCode() == 42000) {
                // User already exists error code
                $this->info("User '{$username}' already exists. Updating permissions.");
            } else {
                // Other database errors
                throw $e;
            }
        }

        $views = DB::select("SHOW FULL TABLES IN `laravel` WHERE TABLE_TYPE LIKE 'VIEW';");

        foreach ($views as $view) {
            $viewName = $view->Tables_in_laravel ?? ''; // Replace with actual column name
            DB::statement("GRANT SELECT ON `laravel`.`{$viewName}` TO '{$username}'@'%';");
        }

        DB::statement("FLUSH PRIVILEGES;");

        $this->info('Permissions updated successfully.');

        return 0;
    }
}
