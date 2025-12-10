<?php

namespace App\Console\Commands;

use App\Models\Actions;
use App\Models\Area;
use App\Models\Configs;
use App\Models\ConfigsInput;
use App\Models\ElementClass;
use App\Models\FormularCreator;
use App\Models\FormularCreatorConfigs;
use App\Models\ElementConditionValue;
use App\Models\ElementConfigs;
use App\Models\FormularCreatorElements;
use App\Models\FormularCreatorRoles;
use App\Models\Role;
use App\Models\User;
use App\Models\Value;
use App\Models\ValueOption;
use App\Models\ValueSets;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class Reset extends Command
{
    protected $signature = 'app:reset';
    protected $description = 'Command description';

    public function handle()
    {
        $this->info('Resetting the application');

        // Run php artisan migrate:fresh
        $this->call('migrate:fresh');

        // Create the list of lists valueSet - just to make sure we can get the id from the db
        // We run it again as the last thing to update values.
        $this->call('app:create-lists-from-list');

        $valueSetWithLists = ValueSets::where('name', 'ValueSets')->first();

        // Create the default user
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@localhost',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Tommy Olsen',
            'email' => 'tommy@live.dk',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Frederik Jørgensen',
            'email' => 'frederik@live.dk',
            'password' => Hash::make('password'),
        ]);

        $this->call('app:create-lists-from-user');

        $valueSet = ValueSets::where('name', 'Brugere')->first();
        $valueSet->headers()->create(['key' => 'department', 'value' => 'Department']);

        $value = ValueOption::where('value_set_id', $valueSet->id)->where('value', 'Admin')->first();
        $value->fields()->create(['key' => 'department', 'value' => 'Odense']);

        $value = ValueOption::where('value_set_id', $valueSet->id)->where('value', 'Tommy Olsen')->first();
        $value->fields()->create(['key' => 'department', 'value' => 'Aalborg']);

        $value = ValueOption::where('value_set_id', $valueSet->id)->where('value', 'Frederik Jørgensen')->first();
        $value->fields()->create(['key' => 'department', 'value' => 'Aarhus']);

        $this->info('Create lists from user completed');

        $int = ElementClass::create(['class' => 'Integer', 'value_set_able' => false]);
        $string = ElementClass::create(['class' => 'String', 'value_set_able' => false]);
        $boolean = ElementClass::create(['class' => 'Boolean', 'value_set_able' => true]);
        $datetime = ElementClass::create(['class' => 'Datetime', 'value_set_able' => false]);

        $list = ElementClass::create(['class' => 'List', 'value_set_able' => true]);
        $text = ElementClass::create(['class' => 'Text', 'value_set_able' => false]);
        $title = ElementClass::create(['class' => 'Title', 'value_set_able' => false]);
        $button = ElementClass::create(['class' => 'Button', 'value_set_able' => false]);
        $condition = ElementClass::create(['class' => 'Condition', 'value_set_able' => true]);
        $selection = ElementClass::create(['class' => 'Selection', 'value_set_able' => true]);
        $selections = ElementClass::create(['class' => 'Selections', 'value_set_able' => true]);
        $autocomplete = ElementClass::create(['class' => 'Autocomplete', 'value_set_able' => true]);
        $formularCreator = ElementClass::create(['class' => 'FormularCreator', 'value_set_able' => true]);
        $formularState = ElementClass::create(['class' => 'FormularState', 'value_set_able' => true]);
        $formularFieldState = ElementClass::create(['class' => 'FormularFieldState', 'value_set_able' => true]);
        $elementValueOptionClass = ElementClass::create(['class' => 'ElementValueOption', 'value_set_able' => false]);

        $allClasses = [
            $text,
            $title,
            $button,
            $selection,
            $selections,
            $list,
            $autocomplete,
            $condition,
        ];

        Actions::create(['action' => 'formularAddSame', 'name' => 'formularAddSame', 'description' => 'formularAddSame', 'class' => 'Button', 'class_id' => $button->id]);
        Actions::create(['action' => 'formularAddOther', 'name' => 'formularAddOther', 'description' => 'formularAddOther','class' => 'Button', 'class_id' => $button->id]);

        $this->info('Create actions completed');

        $valueSet = ValueSets::create([
            'type' => 'Option',
            'name' => 'Ja/Nej',
            'description' => 'Ja/Nej'
        ]);

        $valueSet->headers()->create(['key' => 'label', 'value' => 'Ja/Nej']);

        $valueNej = $valueSet->options()->create(['value' => 'Nej']);
        $valueNej->fields()->create(['key' => 'label', 'value' => 'Nej']);
        $valueJa = $valueSet->options()->create(['value' => 'Ja']);
        $valueJa->fields()->create(['key' => 'label', 'value' => 'Ja']);

        $valueSetIcon = ValueSets::create([
            'type' => 'Option',
            'name' => 'Icon',
            'description' => 'Icon'
        ]);

        $valueSetIcon->headers()->create(['key' => 'label', 'value' => 'Icon']);

        $heart = $valueSetIcon->options()->create(['value' => 'heart']);
        $heart->fields()->create(['key' => 'label', 'value' => 'heart']);
        $valueSetIcon->options()->create(['value' => 'glass'])->fields()->create(['key' => 'label', 'value' => 'glass']);
        $valueSetIcon->options()->create(['value' => 'pencil'])->fields()->create(['key' => 'label', 'value' => 'pencil']);
        $valueSetIcon->options()->create(['value' => 'plus'])->fields()->create(['key' => 'label', 'value' => 'plus']);
        $valueSetIcon->options()->create(['value' => 'star'])->fields()->create(['key' => 'label', 'value' => 'star']);
        $valueSetIcon->options()->create(['value' => 'trash'])->fields()->create(['key' => 'label', 'value' => 'trash']);
        $valueSetIcon->options()->create(['value' => 'user'])->fields()->create(['key' => 'label', 'value' => 'user']);

        $valueSetScale = ValueSets::create([
            'type' => 'Option',
            'name' => '1 til 6',
            'description' => '1 til 6'
        ]);
        $valueSetScale->headers()->create(['key' => 'label', 'value' => '1 til 6']);

        $valueSetScale->options()->create(['value' => '1'])->fields()->create(['key' => 'label', 'value' => '1']);
        $valueSetScale->options()->create(['value' => '2'])->fields()->create(['key' => 'label', 'value' => '2']);
        $valueSetScale->options()->create(['value' => '3'])->fields()->create(['key' => 'label', 'value' => '3']);
        $valueSetScale->options()->create(['value' => '4'])->fields()->create(['key' => 'label', 'value' => '4']);
        $valueSetScale->options()->create(['value' => '5'])->fields()->create(['key' => 'label', 'value' => '5']);
        $valueSetScale->options()->create(['value' => '6'])->fields()->create(['key' => 'label', 'value' => '6']);

        $valueSetDesign = ValueSets::create([
            'type' => 'Option',
            'name' => 'Selection Designs',
            'description' => 'Selection Designs'
        ]);

        $valueSetDesign->headers()->create(['key' => 'label', 'value' => 'Design']);
        $valueSetDesign->options()->create(['value' => 'Checkbox'])->fields()->create(['key' => 'label', 'value' => 'Checkbox']);

        $valueEnighed = $valueSetDesign->options()->create(['value' => 'Agreement']);
        $valueEnighed->fields()->create(['key' => 'label', 'value' => 'Agreement']);

        $valueRadio = $valueSetDesign->options()->create(['value' => 'Radio']);
        $valueRadio->fields()->create(['key' => 'label', 'value' => 'Radio']);

        $valueSetBoolean = ValueSets::create([
            'type' => 'Boolean',
            'name' => 'Boolean',
            'description' => 'Boolean'
        ]);

        $valueSetBoolean->headers()->create(['key' => 'label', 'value' => 'Boolean']);

        $valueSetInt = ValueSets::create([
            'type' => 'Integer',
            'name' => 'Integer',
            'description' => 'Integer'
        ]);

        $valueSetInt->headers()->create(['key' => 'label', 'value' => 'Integer']);

        $valueSetString = ValueSets::create([
            'type' => 'String',
            'name' => 'String',
            'description' => 'String'
        ]);

        $valueSetString->headers()->create(['key' => 'label', 'value' => 'String']);

        $valueSetDatetime = ValueSets::create([
            'type' => 'Datetime',
            'name' => 'Datetime',
            'description' => 'Datetime'
        ]);

        $valueSetDatetime->headers()->create(['key' => 'label', 'value' => 'Datetime']);

        $valueFalse = $valueSetBoolean->booleans()->create(['value' => 0, 'description' => 'Nej']);
        $valueTrue = $valueSetBoolean->booleans()->create(['value' => 1, 'description' => 'Ja']);

        $this->info('Create valueSets completed');

        foreach ($allClasses as $class) {
            $config = Configs::create([
                'config' => 'hideDescription',
                'name' => 'Hide Description',
                'description' => 'This ensures that the description is not shown',
                'class' => $class->class,
                'class_id' => $class->id,
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => Value::valueCreate([
                    'value_set_type' => 'Boolean',
                    'value_set_id' => $valueSetBoolean->id,
                    'value' => $valueTrue->id,
                ])->id,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetBoolean->id,
            ]);
            $config = Configs::create([
                'config' => 'required',
                'name' => 'Required',
                'description' => 'Field is required. If not filled out, the form can be submitted - but is considered incomplete.',
                'class' => $class->class,
                'class_id' => $class->id,
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => Value::valueCreate([
                    'value_set_type' => 'Boolean',
                    'value_set_id' => $valueSetBoolean->id,
                    'value' => $valueTrue->id,
                ])->id,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetBoolean->id,
            ]);
            $config = Configs::create([
                'config' => 'copyFieldFromLatestFormular',
                'name' => 'Copy Field from Latest Formular',
                'description' => 'This ensures that the field is copied from the latest formular of the same type',
                'class' => $class->class,
                'class_id' => $class->id,
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => Value::valueCreate([
                    'value_set_type' => 'Boolean',
                    'value_set_id' => $valueSetBoolean->id,
                    'value' => $valueTrue->id,
                ])->id,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetBoolean->id,
            ]);
            $config = Configs::create([
                'config' => 'copyFieldFromLatestElement',
                'name' => 'Copy Field from Latest Element',
                'description' => 'This ensures that the field is copied from the latest element of the same type',
                'class' => $class->class,
                'class_id' => $class->id,
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => Value::valueCreate([
                    'value_set_type' => 'Boolean',
                    'value_set_id' => $valueSetBoolean->id,
                    'value' => $valueTrue->id,
                ])->id,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetBoolean->id,
            ]);
        }

        $this->info('Create configs completed');

        $classesWithValueOptions = [
            $selection,
            $selections,
            $list,
            $autocomplete,
        ];

        foreach ($classesWithValueOptions as $class)
        {
            $config = Configs::create([
                'config' => 'filterByOtherInput',
                'name' => 'Filter By Other Input',
                'description' => '',
                'class' => $class->class,
                'class_id' => $class->id,
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => null,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetWithLists->id,
            ]);
            $config = Configs::create([
                'config_parent_id' => $config->id,
                'config' => 'filterByOtherInputKey',
                'name' => 'Filter By Other Input',
                'description' => '',
                'class' => null,
                'class_id' => null
            ]);
            ConfigsInput::create([
                'config_id' => $config->id,
                'input_value_id' => null,
                'input_class_id' => $list->id,
                'input_value_set_id' => $valueSetWithLists->id,
            ]);
        }

        $this->info('Create configs completed');

        $configIcon = Configs::create([
            'config' => 'icon',
            'name' => 'Icon',
            'description' => 'Choose a icon for decoration',
            'class' => $formularCreator->class,
            'class_id' => $formularCreator->id,
        ]);
        ConfigsInput::create([
            'config_id' => $configIcon->id,
            'input_value_id' => Value::valueCreate([
                'value_set_type' => 'Option',
                'value_set_id' => $valueSetIcon->id,
                'value' => $heart->id,
            ])->id,
            'input_class_id' => $list->id,
            'input_value_set_id' => $valueSetIcon->id,
        ]);

        $configSelectionDesign = Configs::create([
            'config' => 'selectionDesign',
            'name' => 'Selection Design',
            'description' => 'Choose a design for the Selection',
            'class' => $selection->class,
            'class_id' => $selection->id,
        ]);
        ConfigsInput::create([
            'config_id' => $configSelectionDesign->id,
            'input_value_id' => Value::valueCreate([
                'value_set_type' => 'Option',
                'value_set_id' => $valueSetDesign->id,
                'value' => $valueRadio->id,
            ])->id,
            'input_class_id' => $list->id,
            'input_value_set_id' => $valueSetDesign->id,
        ]);

        $config = Configs::create([
            'config' => 'requiredNeedsAction',
            'name' => 'Required Needs Action',
            'description' => 'The formular has unfilled required fields and needs action',
            'class' => $formularState->class,
            'class_id' => $formularState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueFalse->id,
            ])->id,
            'input_class_id' => $list->id,
            'input_value_set_id' => $valueSetBoolean->id,
        ]);

        $config = Configs::create([
            'config' => 'requiredNeedsAction',
            'name' => 'Required Needs Action',
            'description' => 'The field is required and needs action',
            'class' => $formularFieldState->class,
            'class_id' => $formularFieldState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueFalse->id,
            ])->id,
            'input_class_id' => $list->id,
            'input_value_set_id' => $valueSetBoolean->id,
        ]);

        $config = Configs::create([
            'config' => 'requiredNeedsActionDisplay',
            'name' => 'Required Needs Action Display',
            'description' => 'Display for the usrt that the formular needs action because of required fields',
            'class' => $formularState->class,
            'class_id' => $formularState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueFalse->id,
            ])->id,
            'input_class_id' => $list->id,
            'input_value_set_id' => $valueSetBoolean->id,
        ]);

        $config = Configs::create([
            'config' => 'deleteEmptyDisplay',
            'name' => 'Delete Empty Display',
            'description' => 'Display for the user that the formular is empty and will be deleted af a certain time',
            'class' => $formularState->class,
            'class_id' => $formularState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => null,
            'input_class_id' => $int->id,
            'input_value_set_id' => $valueSetInt->id,
        ]);

        $config = Configs::create([
            'config' => 'deleteIdleDisplay',
            'name' => 'Delete Idle Display',
            'description' => 'Display for the user that the formular is empty and will be deleted af a certain time',
            'class' => $formularState->class,
            'class_id' => $formularState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => null,
            'input_class_id' => $int->id,
            'input_value_set_id' => $valueSetInt->id,
        ]);

        $config = Configs::create([
            'config' => 'derivedFromFields',
            'name' => 'Derived From Fields',
            'description' => 'States that are derived from fields',
            'class' => $formularState->class,
            'class_id' => $formularState->id,
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => null,
            'input_class_id' => $boolean->id,
            'input_value_set_id' => $valueSetBoolean->id,
        ]);

        $config = Configs::create([
            'config' => 'selectionColors',
            'name' => 'Selection Colors',
            'description' => 'Selection Colors',
            'class' => $elementValueOptionClass->class,
            'class_id' => $elementValueOptionClass->id
        ]);
        ConfigsInput::create([
            'config_id' => $config->id,
            'input_value_id' => null,
            'input_class_id' => $int->id,
            'input_value_set_id' => $valueSetInt->id
        ]);

        $this->info('Create configs completed');

        $aalborg = Area::create(['name' => 'Aalborg', 'description' => 'Aalborg', 'identifier' => 'Aalborg']);
        $aarhus = Area::create(['name' => 'Aarhus', 'description' => 'Aarhus', 'identifier' => 'Aarhus']);
        $odense = Area::create(['name' => 'Odense', 'description' => 'Odense', 'identifier' => 'Odense']);
        $kobenhavn = Area::create(['name' => 'København', 'description' => 'København', 'identifier' => 'København']);

        $this->info('Create valueSets completed');

        $this->call('app:create-lists-from-area');

        $this->info('Create lists from area completed');

        $moderator = Role::create(['name' => 'Moderator', 'description' => 'Moderator']);
        $dataist = Role::create(['name' => 'Dataist', 'description' => 'Dataist']);
        $reader = Role::create(['name' => 'Reader', 'description' => 'Reader']);
        $admin = Role::create(['name' => 'Admin', 'description' => 'Admin']);

        // Add all roles and areas to the admin user
        $allAreas = [
            $aalborg,
            $aarhus,
            $odense,
            $kobenhavn,
        ];

        $allRoles = [
            $admin,
            $moderator,
            $dataist,
            $reader,
        ];

        foreach ($allAreas as $area) {
            foreach ($allRoles as $role) {
                $user->roles()->create([
                    'role_id' => $role->id,
                    'area_id' => $area->id,
                ]);
            }
        }

        $this->info('Create roles for area completed');

        // -------------------------------------------------------------------------------------------------------------
        // Formular: APV
        // -------------------------------------------------------------------------------------------------------------

        $valueSetString = ValueSets::create([
            'type' => 'String',
            'name' => 'String',
            'description' => 'String',
        ]);

        $valueSetInt = ValueSets::create([
            'type' => 'Integer',
            'name' => 'Integer',
            'description' => 'Integer',
        ]);

        $formularCreator = FormularCreator::create([
            'name' => 'APV',
            'description' => 'APV for Altidenekko'
        ]);

        FormularCreatorRoles::create([
            'formular_creator_id' => $formularCreator->id,
            'area_id' => $aalborg->id,
            'role_id' => $moderator->id,
        ]);

        FormularCreatorRoles::create([
            'formular_creator_id' => $formularCreator->id,
            'area_id' => $aalborg->id,
            'role_id' => $reader->id,
        ]);

        FormularCreatorRoles::create([
            'formular_creator_id' => $formularCreator->id,
            'area_id' => $aalborg->id,
            'role_id' => $dataist->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $heart->id,
            'value_set_id' => $valueSetIcon->id,
            'value_set_type' => 'Option',
        ]);

        FormularCreatorConfigs::create([
            'formular_creator_id' => $formularCreator->id,
            'config_id' => $configIcon->id,
        ])->inputs()->create([
            'configs_input_id' => $configIcon->inputs()->first()->id,
            'value_id' => $configValue->id,
        ]);

        $e = FormularCreatorElements::create([
            'name' => 'Velkommen til APV i Altidenekko',
            'description' => '',
            'class' => $title->class,
            'class_id' => $title->id,
            'section' => 0,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Du skal udfylde...',
            'description' => 'Du skal udfylde følgende spørgeskema, med spørgsmål om din arbejdsplads.',
            'class' => $text->class,
            'class_id' => $text->id,
            'section' => 0,
            'group' => 0,
            'order' => 1,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Målet med besvarelserne er...',
            'description' => 'Målet med besvarelserne er at få et overblik over, hvordan du oplever dit arbejde og din arbejdsplads. Det er vigtigt, at du svarer så ærligt som muligt. Det er ikke et spørgeskema, hvor der er rigtige eller forkerte svar. Det er dine svar, der er vigtige.',
            'class' => $text->class,
            'class_id' => $text->id,
            'section' => 0,
            'group' => 0,
            'order' => 2,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $valueSetArea = ValueSets::where('name', 'Område')->first();
        $valueSetUser = ValueSets::where('name', 'Brugere')->first();

        $e = FormularCreatorElements::create([
            'name' => 'Udfyld dit navn',
            'description' => '',
            'class' => $autocomplete->class,
            'class_id' => $autocomplete->id,
            'section' => 0,
            'group' => 1,
            'order' => 3,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetUser->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $config = Configs::where('config', 'required')->where('class_id', $autocomplete->id)->first();
        $e->configs()->create([
            'config_id' => $config->id,
        ])->inputs()->create([
            'configs_input_id' => $config->inputs()->first()->id,
            'value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueTrue->id,
            ])->id,
        ]);

        $config = Configs::where('config', 'copyFieldFromLatestElement')->where('class_id', $autocomplete->id)->first();
        $e->configs()->create([
            'config_id' => $config->id,
        ])->inputs()->create([
            'configs_input_id' => $config->inputs()->first()->id,
            'value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueTrue->id,
            ])->id,
        ]);

        $config = Configs::where('config', 'copyFieldFromLatestFormular')->where('class_id', $autocomplete->id)->first();
        $e->configs()->create([
            'config_id' => $config->id,
        ])->inputs()->create([
            'configs_input_id' => $config->inputs()->first()->id,
            'value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueTrue->id,
            ])->id,
        ]);

        $config = Configs::where('config', 'hideDescription')->where('class_id', $autocomplete->id)->first();
        $e->configs()->create([
            'config_id' => $config->id,
        ])->inputs()->create([
            'configs_input_id' => $config->inputs()->first()->id,
            'value_id' => Value::valueCreate([
                'value_set_type' => 'Boolean',
                'value_set_id' => $valueSetBoolean->id,
                'value' => $valueTrue->id,
            ])->id,
        ]);

        $e = FormularCreatorElements::create([
            'name' => 'Angiv din afdeling',
            'description' => '',
            'class' => $list->class,
            'class_id' => $list->id,
            'section' => 0,
            'group' => 1,
            'order' => 4,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetArea->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Tilfredshed på arbejdspladesen',
            'description' => '',
            'class' => $title->class,
            'class_id' => $title->id,
            'section' => 1,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Jeg er tilfreds med at arbejde på min arbejdsplads',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 1,
            'group' => 0,
            'order' => 1,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetScale->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueEnighed->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Samarbejdet på arbejdspladsen',
            'description' => '',
            'class' => $title->class,
            'class_id' => $title->id,
            'section' => 2,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Jeg oplever at vi er gode til at samarbejde om opgaveløsningen',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 2,
            'group' => 0,
            'order' => 1,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetScale->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueEnighed->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Jeg oplever at vi på min arbejdspalds er enige om hvad der de vigtigste opgaver',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 2,
            'group' => 0,
            'order' => 2,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetScale->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueEnighed->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Mobning',
            'description' => '',
            'class' => $title->class,
            'class_id' => $title->id,
            'section' => 10,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Der er tale om mobning...',
            'description' => 'Der er tale om mobning, hvis du gentagne gange udsættes for handlinger, som du opfatter som sårende eller nedværdigende, og som du finder vanskelige at håndtere og få standset',
            'class' => $text->class,
            'class_id' => $text->id,
            'section' => 10,
            'group' => 0,
            'order' => 1,
            'formular_creator_id' => $formularCreator->id
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $mobning = FormularCreatorElements::create([
            'name' => 'Har du inden for de seneste 12 måneder været udsat for mobning på din arbejdsplads?',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 11,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSet->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueRadio->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $mobning->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $mobning->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $condition = FormularCreatorElements::create([
            'name' => 'Condition: hvis ja til mobning',
            'description' => '',
            'class' => $condition->class,
            'class_id' => $condition->id,
            'section' => 11,
            'group' => 0,
            'order' => 1,
            'formular_creator_id' => $formularCreator->id
        ]);

        $condition->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        ElementConditionValue::create([
            'element_id_condition' => $condition->id,
            'element_id_target' => $mobning->id,
            'value_option_id' => $valueJa->id
        ]);

        // -------------------------------------------------------------------------------------------------------------

        $valueSetWho = ValueSets::create([
            'type' => 'Option',
            'name' => 'Hvem har udsat dig for mobning?',
            'description' => 'Hvem har udsat dig for mobning?',
        ]);

        $valueSetWho->headers()->create(['key' => 'label', 'value' => 'Hvem']);
        $valueSetWho->options()->create(['value' => 'Kollega'])->fields()->create(['key' => 'label', 'value' => 'Kollega']);
        $valueSetWho->options()->create(['value' => 'Leder'])->fields()->create(['key' => 'label', 'value' => 'Leder']);
        $valueSetWho->options()->create(['value' => 'Intern samarbejdspartner'])->fields()->create(['key' => 'label', 'value' => 'Intern samarbejdspartner']);
        $valueSetWho->options()->create(['value' => 'En borger'])->fields()->create(['key' => 'label', 'value' => 'En borger']);

        $e = FormularCreatorElements::create([
            'name' => 'Hvem har udsat dig for mobning?',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 11,
            'group' => 0,
            'order' => 2,
            'formular_creator_id' => $formularCreator->id,
            'parent_id' => $condition->id,
            'value_set_id' => $valueSetWho->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueRadio->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        // -------------------------------------------------------------------------------------------------------------

        $valueSetFrekvens = ValueSets::create([
            'type' => 'Option',
            'name' => 'Hvor ofte er det sket?',
            'description' => 'Hvor ofte er det sket?',
        ]);

        $valueSetFrekvens->headers()->create(['key' => 'label', 'value' => 'Hvor ofte']);
        $valueSetFrekvens->options()->create(['value' => 'Dagligt'])->fields()->create(['key' => 'label', 'value' => 'Dagligt']);
        $valueSetFrekvens->options()->create(['value' => 'Ugentligt'])->fields()->create(['key' => 'label', 'value' => 'Ugentligt']);
        $valueSetFrekvens->options()->create(['value' => 'Månedligt'])->fields()->create(['key' => 'label', 'value' => 'Månedligt']);
        $valueSetFrekvens->options()->create(['value' => 'Sjældnere'])->fields()->create(['key' => 'label', 'value' => 'Sjældnere']);

        $e = FormularCreatorElements::create([
            'name' => 'Hvor ofte har du været udsat for mobning?',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 11,
            'group' => 0,
            'order' => 2,
            'formular_creator_id' => $formularCreator->id,
            'parent_id' => $condition->id,
            'value_set_id' => $valueSetFrekvens->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueRadio->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        // -------------------------------------------------------------------------------------------------------------

        $e = FormularCreatorElements::create([
            'name' => 'Kontrol for at tjekke at ja/nej ikke trigger condition',
            'description' => '',
            'class' => $selection->class,
            'class_id' => $selection->id,
            'section' => 11,
            'group' => 0,
            'order' => 3,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSet->id,
        ]);

        $configValue = Value::create([
            'value_option_id' => $valueRadio->id,
            'value_set_id' => $valueSetDesign->id,
            'value_set_type' => 'Option',
        ]);

        ElementConfigs::create([
            'formular_creator_element_id' => $e->id,
            'value_id' => $configValue->id,
            'config_id' => $configSelectionDesign->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);

        $this->info('Create formular APV completed');

        // -------------------------------------------------------------------------------------------------------------

        $formularCreatorClass = ElementClass::where('class', 'FormularCreator')->first();
        $valueSetInt = ValueSets::where('type', 'Integer')->first();

        $configDeleteEmpty = Configs::create([
            'config' => 'deleteEmpty',
            'name' => 'Delete Empty',
            'description' => 'Delete Empty',
            'class' => $formularCreatorClass->class,
            'class_id' => $formularCreatorClass->id,
        ]);
        ConfigsInput::create([
            'config_id' => $configDeleteEmpty->id,
            'input_value_id' => null,
            'input_class_id' => $int->id,
            'input_value_set_id' => $valueSetInt->id,
        ]);

        $configDeleteIdle = Configs::create([
            'config' => 'deleteIdle',
            'name' => 'Delete Idle',
            'description' => 'Delete Idle',
            'class' => $formularCreatorClass->class,
            'class_id' => $formularCreatorClass->id,
        ]);
        ConfigsInput::create([
            'config_id' => $configDeleteIdle->id,
            'input_value_id' => null,
            'input_class_id' => $int->id,
            'input_value_set_id' => $valueSetInt->id,
        ]);

        // Make a FormularCreator with a single "Udfyld dit navn" element

        $formularCreator = FormularCreator::create([
            'name' => 'Choose your name',
            'description' => 'Choose your name',
        ]);

        $formularCreator->formularRoles()->create(['role_id' => $reader->id, 'area_id' => $aalborg->id]);
        $formularCreator->formularRoles()->create(['role_id' => $dataist->id, 'area_id' => $aalborg->id]);
        $formularCreator->formularRoles()->create(['role_id' => $moderator->id, 'area_id' => $aalborg->id]);

        $e = FormularCreatorElements::create([
            'name' => 'Udfyld dit navn',
            'description' => '',
            'class' => $autocomplete->class,
            'class_id' => $autocomplete->id,
            'section' => 0,
            'group' => 0,
            'order' => 0,
            'formular_creator_id' => $formularCreator->id,
            'value_set_id' => $valueSetUser->id,
        ]);

        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $reader->id, 'area_id' => $aalborg->id]);
        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $dataist->id, 'area_id' => $aalborg->id]);
        $e->access()->create(['formular_creator_id' => $formularCreator->id, 'role_id' => $moderator->id, 'area_id' => $aalborg->id]);

        // -------------------------------------------------------------------------------------------------------------
        // Things that should go last.

        $this->call('app:create-lists-from-list');
    }
}
