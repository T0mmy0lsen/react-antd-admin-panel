<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\ConfigsController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DatasetController;
use App\Http\Controllers\ElementClassController;
use App\Http\Controllers\ExcelExportController;
use App\Http\Controllers\FormularController;
use App\Http\Controllers\FormularCreatorConfigsController;
use App\Http\Controllers\FormularCreatorController;
use App\Http\Controllers\FormularCreatorTriggerController;
use App\Http\Controllers\FormularCreatorRolesController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ValueSetController;
use App\Http\Controllers\ActionsController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FormularCreatorElementController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Check if the User is logged-in
Route::middleware([])->get('/check', [Controller::class, 'check']);

// The User; gets the User; from Auth::user()
Route::middleware([])->get('/user', [Controller::class, 'user']);

// --------------------------------------------------------------------------------------------------------------------------------------

///     /formularCreatorsByUser     -> All FormularCreators are listed
///         /formularCreate         -> The User can create a Formular
///         /formularOpen           -> The User can open the formular
///         /formularSave           -> The User can save the formular
///
///     /formularCreatorsByUser     -> All FormularCreators are listed
///         /formularsByUser        -> The Formulars that already have been created are listed
///         /formularOpen           -> The User can open the formular
///         /formularSave           -> The User can save the formular

// The (F) Readers; gets FormularCreator(s) through FormularReader
// This tells which Users may see what Formular(s)
// This is done by matching (Role, Area) in UserRole and FormularReader
Route::middleware(['auth:sanctum'])->get('/formularCreatorsByReader', [FormularCreatorRolesController::class, 'formularCreatorsByReader']);
Route::middleware(['auth:sanctum'])->get('/formularCreatorsByReaderSearch', [FormularCreatorRolesController::class, 'formularCreatorsByReaderSearch']);

// The (F) Readers; gets its Formulars; given the id of a FormularCreator
// The (F) Readers; must be the owner and have matching (Role, Area) in UserRole and FormularReader
Route::middleware(['auth:sanctum'])->get('/formularsByUser', [FormularController::class, 'formularsByUser']);

// The (F) Readers; gets a Formular
Route::middleware(['auth:sanctum'])->get('/formularOpen', [FormularController::class, 'formularOpen']);
// The (F) Readers; saves a Formular
Route::middleware(['auth:sanctum'])->post('/formularSave', [FormularController::class, 'formularSave']);
// The (F) Readers; creates a Formular
Route::middleware(['auth:sanctum'])->post('/formularCreate', [FormularController::class, 'formularCreate']);

// The User does

// --------------------------------------------------------------------------------------------------------------------------------------

///     /formularCreatorsByDatasetReader        -> The (F) DatasetReader gets a list of all FormularCreators for which they may see containing data
///         /formularsByDatasetReader           -> The (F) DatasetReader gets all the formulars for the selected FormularCreator

// The (F) DatasetReader; gets FormularCreator(s) through FormularDatasetReader
// This tells which Users (DatasetReaders) may see the data for Formular(s)
// This is done by matching (Role, Area) in UserRole and FormularDatasetReader
// The data is filtered by matching Area
Route::middleware(['auth:sanctum'])->get('/formularCreatorsByDataist', [FormularCreatorRolesController::class, 'formularCreatorsByDataist']);
// The (F) DatasetReader; gets FormularCreator(s) through FormularDatasetReader
Route::middleware(['auth:sanctum'])->get('/formularsByDataist', [DatasetController::class, 'formularsByDataist']);
// The Dataist exports the data as Excel
Route::middleware(['auth:sanctum'])->get('/formularsByDataistExportExcel', [ExcelExportController::class, 'formularsByDataistExportExcel']);

// --------------------------------------------------------------------------------------------------------------------------------------
//  MODERATOR
// --------------------------------------------------------------------------------------------------------------------------------------

///     /formularCreatorsByModerator                -> The (F) Moderator; can read all FormularCreators
///         /formulaReaders                         -> The (F) Moderator; reads formular creators from the FormularCreators
///             /formularReaderCreate               -> The (F) Moderator; can add new creators
///         /formularDatasetReaders                 -> The (F) Moderator; reads formular dataset readers from the FormularCreators
///             /formularDatasetReaderCreate        -> The (F) Moderator; can add new dataset readers

// The Moderator gets all FormularCreators
Route::middleware(['auth:sanctum'])->get('/formularCreatorsByModerator', [FormularCreatorRolesController::class, 'formularCreatorsByModerator']);
Route::middleware(['auth:sanctum'])->get('/formularCreatorsByModeratorSearch', [FormularCreatorRolesController::class, 'formularCreatorsByModeratorSearch']);

// The Moderator gets all FormularReader
Route::middleware(['auth:sanctum'])->get('/formularCreatorRoles', [FormularCreatorRolesController::class, 'formularCreatorRoles']);
// The Moderator creates a FormularReader
Route::middleware(['auth:sanctum'])->post('/formularCreatorRolesCreate', [FormularCreatorRolesController::class, 'formularCreatorRolesCreate']);

// The Moderator gets all FormularCreatorTriggers
Route::middleware(['auth:sanctum'])->get('/formularCreatorTriggers', [FormularCreatorTriggerController::class, 'formularCreatorTriggers']);
// The Moderator gets all FormularCreatorTriggers
// Route::middleware(['auth:sanctum'])->get('/formularCreatorTriggerSearch', [FormularCreatorTriggerController::class, 'formularCreatorTriggerSearch']);
// The Moderator creates a FormularCreatorTrigger
Route::middleware(['auth:sanctum'])->post('/formularCreatorTriggerCreate', [FormularCreatorTriggerController::class, 'formularCreatorTriggerCreate']);

// --------------------------------------------------------------------------------------------------------------------------------------

///     /formularCreatorsByModerator                -> The (F) FormularCreator can read all FormularCreators
///     /formularCreatorCreate                      -> Create a FormularCreator
///         /formularCreator                        -> Get the FormularCreator
///             /formularCreatorElements            -> Get the FormularCreators Elements
///             /formularCreatorElementCreate       -> Create new Elements for the Formular

Route::middleware(['auth:sanctum'])->get('/formularCreator', [FormularCreatorController::class, 'formularCreator']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorCreate', [FormularCreatorController::class, 'formularCreatorCreate']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorConfig', [FormularCreatorController::class, 'formularCreatorConfig']);

Route::middleware(['auth:sanctum'])->get('/formularCreatorElements', [FormularCreatorElementController::class, 'formularCreatorElements']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorElementCreate', [FormularCreatorElementController::class, 'formularCreatorElementCreate']);
Route::middleware(['auth:sanctum'])->get('/formularCreatorElementAccess', [FormularCreatorElementController::class, 'formularCreatorElementAccess']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorElementAccessCreate', [FormularCreatorElementController::class, 'formularCreatorElementAccessCreate']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorElementUpdateMeta', [FormularCreatorElementController::class, 'formularCreatorElementUpdateMeta']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorElementDelete', [FormularCreatorElementController::class, 'formularCreatorElementDelete']);

// --------------------------------------------------------------------------------------------------------------------------------------

// (F) Administrator

Route::middleware(['auth:sanctum'])->get('/valueSets', [ValueSetController::class, 'valueSets']);
Route::middleware(['auth:sanctum'])->get('/valueSetHeaders', [ValueSetController::class, 'valueSetHeaders']);
Route::middleware(['auth:sanctum'])->get('/values', [ValueSetController::class, 'values']);
Route::middleware(['auth:sanctum'])->get('/valueOptions', [ValueSetController::class, 'valueOptions']);
Route::middleware(['auth:sanctum'])->post('/valueSetHeaderCreate', [ValueSetController::class, 'valueSetHeaderCreate']);
Route::middleware(['auth:sanctum'])->post('/valueSetCreate', [ValueSetController::class, 'valueSetCreate']);
Route::middleware(['auth:sanctum'])->post('/valueCreate', [ValueSetController::class, 'valueCreate']);

// Values for Search -> can be used by the Formular Reader
Route::middleware(['auth:sanctum'])->get('/valuesByQuery', [ValueSetController::class, 'valuesByQuery']);

Route::middleware(['auth:sanctum'])->get('/areas', [AreaController::class, 'areas']);
Route::middleware(['auth:sanctum'])->get('/areaSearch', [AreaController::class, 'areaSearch']);
Route::middleware(['auth:sanctum'])->post('/areaCreate', [AreaController::class, 'areaCreate']);

Route::middleware(['auth:sanctum'])->get('/roles', [RoleController::class, 'roles']);

Route::middleware(['auth:sanctum'])->get('/users', [UserController::class, 'users']);
Route::middleware(['auth:sanctum'])->post('/userCreate', [UserController::class, 'userCreate']);
Route::middleware(['auth:sanctum'])->get('/userRoles', [UserController::class, 'userRoles']);
Route::middleware(['auth:sanctum'])->post('/userRoleCreate', [UserController::class, 'userRoleCreate']);

// Actions
Route::middleware(['auth:sanctum'])->get('/actions', [ActionsController::class, 'actions']);
// Classes
Route::middleware(['auth:sanctum'])->get('/classes', [ElementClassController::class, 'classes']);
// Configs
Route::middleware(['auth:sanctum'])->get('/configs', [ConfigsController::class, 'configs']);
Route::middleware(['auth:sanctum'])->get('/configsForElements', [ConfigsController::class, 'configsForElements']);
Route::middleware(['auth:sanctum'])->post('/configsForElementsSave', [ConfigsController::class, 'configsForElementsSave']);

// Configs for FormularCreator
Route::middleware(['auth:sanctum'])->get('/formularCreatorConfigs', [FormularCreatorConfigsController::class, 'configs']);
Route::middleware(['auth:sanctum'])->get('/formularCreatorConfigsForFormularCreator', [FormularCreatorConfigsController::class, 'configsForFormularCreator']);
Route::middleware(['auth:sanctum'])->post('/formularCreatorConfigsForFormularCreatorSave', [FormularCreatorConfigsController::class, 'configsForFormularCreatorSave']);

// --------------------------------------------------------------------------------------------------------------------------------------
// TOKEN
// --------------------------------------------------------------------------------------------------------------------------------------

Route::middleware(['auth:sanctum'])->post('/tokensCreate', [TokenController::class, 'tokensCreate']);
Route::middleware(['auth:sanctum'])->post('/tokensRevoke', [TokenController::class, 'tokensRevoke']);
Route::middleware(['auth:sanctum'])->get('/tokens', [TokenController::class, 'tokens']);

// --------------------------------------------------------------------------------------------------------------------------------------
// IMPORT
// --------------------------------------------------------------------------------------------------------------------------------------

// Get a Value Set
Route::middleware(['auth:sanctum'])->get('/import/valueSet', [ImportController::class, 'valueSet']);
// Search for a Value Set
Route::middleware(['auth:sanctum'])->get('/import/valueSetSearch', [ImportController::class, 'valueSetSearch']);
// Get all Value Sets
Route::middleware(['auth:sanctum'])->get('/import/valueSets', [ImportController::class, 'valueSets']);
// Create a Value Set
Route::middleware(['auth:sanctum'])->post('/import/valueSetCreate', [ImportController::class, 'valueSetCreate']);
// Update a Value Set
Route::middleware(['auth:sanctum'])->post('/import/valueSetUpdate', [ImportController::class, 'valueSetUpdate']);
// Delete a Value Set
Route::middleware(['auth:sanctum'])->post('/import/valueSetDelete', [ImportController::class, 'valueSetDelete']);

// Get a Value
Route::middleware(['auth:sanctum'])->get('/import/value', [ImportController::class, 'value']);
// Search for a Value
Route::middleware(['auth:sanctum'])->get('/import/valueSearch', [ImportController::class, 'valueSearch']);
// Get all Values
Route::middleware(['auth:sanctum'])->get('/import/values', [ImportController::class, 'values']);
// Create Values
Route::middleware(['auth:sanctum'])->post('/import/valuesCreate', [ImportController::class, 'valuesCreate']);
// Update Values
Route::middleware(['auth:sanctum'])->post('/import/valuesUpdate', [ImportController::class, 'valuesUpdate']);
// Delete Values
Route::middleware(['auth:sanctum'])->post('/import/valuesDelete', [ImportController::class, 'valuesDelete']);

// Get data from Formular
Route::middleware(['auth:sanctum'])->get('/export/formularView', [ExportController::class, 'formularView']);

// Import and update users
Route::middleware(['auth:sanctum'])->post('/import/users', [ImportController::class, 'users']);

// --------------------------------------------------------------------------------------------------------------------------------------

