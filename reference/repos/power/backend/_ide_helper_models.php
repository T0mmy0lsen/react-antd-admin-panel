<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Actions
 *
 * @property int $id
 * @property string $action
 * @property string $name
 * @property string $description
 * @property string $class
 * @property int $class_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|Actions newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Actions newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Actions onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Actions query()
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Actions withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Actions withoutTrashed()
 */
	class Actions extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Area
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int|null $parent_area_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|Area newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Area newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Area onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Area query()
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereParentAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Area withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Area withoutTrashed()
 */
	class Area extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Configs
 *
 * @property int $id
 * @property string $config
 * @property string $name
 * @property string $description
 * @property int|null $class_id
 * @property string|null $class
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ConfigsInput> $inputs
 * @property-read int|null $inputs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Configs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Configs newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Configs onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Configs query()
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configs withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Configs withoutTrashed()
 */
	class Configs extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ConfigsInput
 *
 * @property int $id
 * @property int $config_id
 * @property int|null $input_value_id
 * @property int|null $input_class_id
 * @property int|null $input_value_set_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Configs|null $config
 * @property-read string $backend_class
 * @property-read \App\Models\ElementClass|null $inputClass
 * @property-read \App\Models\Value|null $inputValue
 * @property-read \App\Models\ValueSets|null $inputValueSet
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput query()
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereInputClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereInputValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereInputValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ConfigsInput withoutTrashed()
 */
	class ConfigsInput extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementAccess
 *
 * @property int $id
 * @property int $formular_creator_element_id
 * @property int $formular_creator_id
 * @property int $area_id
 * @property int $role_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Area|null $area
 * @property-read string $backend_class
 * @property-read \App\Models\Role|null $role
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereFormularCreatorElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementAccess withoutTrashed()
 */
	class ElementAccess extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementActions
 *
 * @property int $id
 * @property int $formular_creator_element_id
 * @property int $formular_creator_id
 * @property int $action_id
 * @property string $action
 * @property string $label
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereActionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereFormularCreatorElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementActions withoutTrashed()
 */
	class ElementActions extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementClass
 *
 * @property int $id
 * @property string $class
 * @property int $value_set_able
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Actions> $actions
 * @property-read int|null $actions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Configs> $configs
 * @property-read int|null $configs_count
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass whereValueSetAble($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementClass withoutTrashed()
 */
	class ElementClass extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementConditionValue
 *
 * @property int $id
 * @property int $element_id_condition
 * @property int $element_id_target
 * @property int $value_option_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereElementIdCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereElementIdTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue whereValueOptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConditionValue withoutTrashed()
 */
	class ElementConditionValue extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementConfigs
 *
 * @property int $id
 * @property int $formular_creator_element_id
 * @property int $config_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Configs|null $config
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ElementConfigsInput> $inputs
 * @property-read int|null $inputs_count
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereFormularCreatorElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigs withoutTrashed()
 */
	class ElementConfigs extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementConfigsInput
 *
 * @property int $id
 * @property int $element_config_id
 * @property int $configs_input_id
 * @property int|null $filter_id
 * @property int|null $value_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ConfigsInput $configsInput
 * @property-read \App\Models\ElementFilterValue|null $filter
 * @property-read string $backend_class
 * @property-read \App\Models\Value|null $value
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereConfigsInputId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereElementConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereFilterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput whereValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementConfigsInput withoutTrashed()
 */
	class ElementConfigsInput extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ElementFilterValue
 *
 * @property int $id
 * @property int $target_element_id
 * @property int $target_header_id
 * @property int $filter_by_element_id
 * @property int $filter_by_header_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FormularCreatorElements $filterByElement
 * @property-read \App\Models\ValueSetsHeader $filterByHeader
 * @property-read string $backend_class
 * @property-read \App\Models\FormularCreatorElements $targetElement
 * @property-read \App\Models\ValueSetsHeader $targetHeader
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue query()
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereFilterByElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereFilterByHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereTargetElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereTargetHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ElementFilterValue whereUpdatedAt($value)
 */
	class ElementFilterValue extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Formular
 *
 * @property int $id
 * @property int $user_id
 * @property int $formular_creator_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FormularCreator|null $formularCreator
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularValue> $formularValues
 * @property-read int|null $formular_values_count
 * @property-read string $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularTrigger> $triggers
 * @property-read int|null $triggers_count
 * @method static \Illuminate\Database\Eloquent\Builder|Formular newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Formular newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Formular onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Formular query()
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formular withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Formular withoutTrashed()
 */
	class Formular extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreator
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularCreatorConfigs> $configs
 * @property-read int|null $configs_count
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularCreatorElements> $elements
 * @property-read int|null $elements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularCreatorRoles> $formularRoles
 * @property-read int|null $formular_roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Formular> $formulars
 * @property-read int|null $formulars_count
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreator withoutTrashed()
 */
	class FormularCreator extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreatorConfigs
 *
 * @property int $id
 * @property int $formular_creator_id
 * @property int $config_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Configs|null $config
 * @property-read string $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularCreatorConfigsInput> $inputs
 * @property-read int|null $inputs_count
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigs withoutTrashed()
 */
	class FormularCreatorConfigs extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreatorConfigsInput
 *
 * @property int $id
 * @property int $formular_creator_config_id
 * @property int $configs_input_id
 * @property int $value_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ConfigsInput $configsInput
 * @property-read string $backend_class
 * @property-read \App\Models\Value $value
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereConfigsInputId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereFormularCreatorConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput whereValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorConfigsInput withoutTrashed()
 */
	class FormularCreatorConfigsInput extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreatorElements
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $class
 * @property int $class_id
 * @property int $section
 * @property int $group
 * @property int $order
 * @property int $formular_creator_id
 * @property int|null $parent_id
 * @property int|null $value_set_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ElementAccess> $access
 * @property-read int|null $access_count
 * @property-read \App\Models\ElementActions|null $action
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ElementConditionValue> $condition
 * @property-read int|null $condition_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ElementConfigs> $configs
 * @property-read int|null $configs_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, FormularCreatorElements> $elements
 * @property-read int|null $elements_count
 * @property-read string $backend_class
 * @property-read \App\Models\ValueSets|null $valueSet
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereSection($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorElements withoutTrashed()
 */
	class FormularCreatorElements extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreatorRoles
 *
 * @property int $id
 * @property int $formular_creator_id
 * @property int $role_id
 * @property int $area_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Area|null $area
 * @property-read string $backend_class
 * @property-read \App\Models\Role|null $role
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserRoles> $userRoles
 * @property-read int|null $user_roles_count
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorRoles withoutTrashed()
 */
	class FormularCreatorRoles extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularCreatorTriggers
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $formular_creator_id_when
 * @property int $formular_creator_id_then
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FormularCreator|null $formularThen
 * @property-read \App\Models\FormularCreator|null $formularWhen
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereFormularCreatorIdThen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereFormularCreatorIdWhen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularCreatorTriggers withoutTrashed()
 */
	class FormularCreatorTriggers extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularFieldState
 *
 * @property int $id
 * @property int $formular_id
 * @property int $formular_creator_id
 * @property int $formular_creator_element_id
 * @property int|null $element_config_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularFieldStateValue> $stateValue
 * @property-read int|null $state_value_count
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereElementConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereFormularCreatorElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereFormularId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldState withoutTrashed()
 */
	class FormularFieldState extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularFieldStateValue
 *
 * @property int $id
 * @property int $formular_field_state_id
 * @property int|null $config_id
 * @property int|null $value_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Configs|null $config
 * @property-read string $backend_class
 * @property-read \App\Models\Value|null $value
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereFormularFieldStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue whereValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularFieldStateValue withoutTrashed()
 */
	class FormularFieldStateValue extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularJobStatus
 *
 * @property int $id
 * @property int $formular_id
 * @property int $formular_creator_config_id
 * @property int $config_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereFormularCreatorConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereFormularId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularJobStatus withoutTrashed()
 */
	class FormularJobStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularState
 *
 * @property int $id
 * @property int $formular_id
 * @property int $formular_creator_id
 * @property int|null $formular_creator_config_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FormularStateValue> $stateValue
 * @property-read int|null $state_value_count
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereFormularCreatorConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereFormularId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularState withoutTrashed()
 */
	class FormularState extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularStateValue
 *
 * @property int $id
 * @property int $formular_state_id
 * @property int|null $config_id
 * @property int|null $value_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Configs|null $config
 * @property-read string $backend_class
 * @property-read \App\Models\Value|null $value
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereConfigId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereFormularStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue whereValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularStateValue withoutTrashed()
 */
	class FormularStateValue extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularTrigger
 *
 * @property int $id
 * @property int $formular_id_when
 * @property int $formular_id_then
 * @property int $formular_creator_trigger_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @property-read \App\Models\FormularCreatorTriggers|null $triggerCreator
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereFormularCreatorTriggerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereFormularIdThen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereFormularIdWhen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularTrigger withoutTrashed()
 */
	class FormularTrigger extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\FormularValue
 *
 * @property int $id
 * @property int $formular_id
 * @property int $formular_creator_id
 * @property int $formular_creator_element_id
 * @property int $value_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FormularCreatorElements|null $element
 * @property-read \App\Models\Formular|null $formular
 * @property-read string $backend_class
 * @property-read \App\Models\Value|null $value
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue query()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereFormularCreatorElementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereFormularCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereFormularId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue whereValueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FormularValue withoutTrashed()
 */
	class FormularValue extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Role
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Role withoutTrashed()
 */
	class Role extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property mixed $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $backend_class
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserRoles> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User withoutTrashed()
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\UserRoles
 *
 * @property int $id
 * @property int $user_id
 * @property int $area_id
 * @property int $role_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Area|null $area
 * @property-read string $backend_class
 * @property-read \App\Models\Role|null $role
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|UserRoles withoutTrashed()
 */
	class UserRoles extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Value
 *
 * @property int $id
 * @property int|null $value_set_id
 * @property int|null $value_datetime_id
 * @property int|null $value_option_id
 * @property int|null $value_text_id
 * @property int|null $value_int_id
 * @property int|null $value_boolean_id
 * @property string|null $debug_value
 * @property string|null $debug_description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @property-read \App\Models\ValueBoolean|null $valueBoolean
 * @property-read \App\Models\ValueDatetime|null $valueDatetime
 * @property-read \App\Models\ValueInt|null $valueInt
 * @property-read \App\Models\ValueOption|null $valueOption
 * @property-read \App\Models\ValueString|null $valueText
 * @method static \Illuminate\Database\Eloquent\Builder|Value newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Value newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Value onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Value query()
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereDebugDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereDebugValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueBooleanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueDatetimeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueIntId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueOptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value whereValueTextId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Value withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Value withoutTrashed()
 */
	class Value extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueBoolean
 *
 * @property int $id
 * @property int $value_set_id
 * @property int $value
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueBoolean withoutTrashed()
 */
	class ValueBoolean extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueDatetime
 *
 * @property int $id
 * @property int $value_set_id
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueDatetime withoutTrashed()
 */
	class ValueDatetime extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueInt
 *
 * @property int $id
 * @property int $value_set_id
 * @property int $value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueInt withoutTrashed()
 */
	class ValueInt extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueOption
 *
 * @property int $id
 * @property int $value_set_id
 * @property string $value
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ValueOptionFields> $fields
 * @property-read int|null $fields_count
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOption withoutTrashed()
 */
	class ValueOption extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueOptionFields
 *
 * @property int $id
 * @property int $value_option_id
 * @property string $key
 * @property string|null $value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields whereValueOptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueOptionFields withoutTrashed()
 */
	class ValueOptionFields extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueSets
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $type
 * @property int $system
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ValueBoolean> $booleans
 * @property-read int|null $booleans_count
 * @property-read mixed $backend_class
 * @property-read \Illuminate\Database\Eloquent\Collection $collection
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ValueSetsHeader> $headers
 * @property-read int|null $headers_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ValueOption> $options
 * @property-read int|null $options_count
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereSystem($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSets withoutTrashed()
 */
	class ValueSets extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueSetsHeader
 *
 * @property int $id
 * @property int $value_set_id
 * @property string $key
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @property-read \App\Models\ValueSets $valueSet
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueSetsHeader withoutTrashed()
 */
	class ValueSetsHeader extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ValueString
 *
 * @property int $id
 * @property int $value_set_id
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $backend_class
 * @property-read \App\Models\ValueSets $valueSet
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString query()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString whereValueSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ValueString withoutTrashed()
 */
	class ValueString extends \Eloquent {}
}

