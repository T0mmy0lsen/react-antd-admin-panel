"use strict";
exports.__esModule = true;
exports.Tree = exports.Main = exports.Path = exports.Post = exports.Alert = exports.Steps = exports.Radio = exports.Sider = exports.Space = exports.Title = exports.Modal = exports.Input = exports.Route = exports.Value = exports.Cycle = exports.Result = exports.Search = exports.Button = exports.Drawer = exports.Upload = exports.Select = exports.Switch = exports.Access = exports.Action = exports.Slider = exports.Creator = exports.Default = exports.Formula = exports.Helpers = exports.Mapping = exports.Section = exports.MenuItem = exports.Multiple = exports.ListItem = exports.TreeItem = exports.Checkbox = exports.RadioItem = exports.StepsItem = exports.Conditions = exports.Typography = exports.SelectItem = exports.DatePicker = exports.ListHeader = exports.RangePicker = exports.CheckboxItem = exports.Autocomplete = exports.ListDraggable = exports.ConditionsItem = exports.DatePickerRange = exports.DatePickerToggle = void 0;
exports.debounce = exports.Get = exports.Item = exports.Menu = exports.List = void 0;
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait)
        wait = 100;
    function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        }
        else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
            }
        }
    }
    var debounced = function () {
        // @ts-ignore
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout)
            timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
    debounced['clear'] = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    debounced['flush'] = function () {
        if (timeout) {
            result = func.apply(context, args);
            context = args = null;
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounced;
}
exports.debounce = debounce;
var main_1 = require("./main");
exports.Main = main_1["default"];
var Mapping_1 = require("./utils/Mapping");
exports.Mapping = Mapping_1["default"];
var Helpers_1 = require("./utils/Helpers");
exports.Helpers = Helpers_1["default"];
var Access_1 = require("./utils/Access");
exports.Access = Access_1["default"];
var Formula_1 = require("./models/Formula");
exports.Formula = Formula_1["default"];
var Action_1 = require("./models/Action");
exports.Action = Action_1["default"];
var Cycle_1 = require("./models/Cycle");
exports.Cycle = Cycle_1["default"];
var Value_1 = require("./models/Value");
exports.Value = Value_1["default"];
var Route_1 = require("./models/Route");
exports.Route = Route_1["default"];
var Post_1 = require("./models/Post");
exports.Post = Post_1["default"];
var Path_1 = require("./models/Path");
exports.Path = Path_1["default"];
var Get_1 = require("./models/Get");
exports.Get = Get_1["default"];
var Default_1 = require("./models/builder/Default");
exports.Default = Default_1["default"];
var Section_1 = require("./models/builder/Section");
exports.Section = Section_1["default"];
var DatePickerToggle_1 = require("./models/builder/DatePickerToggle");
exports.DatePickerToggle = DatePickerToggle_1["default"];
var DatePickerRange_1 = require("./models/builder/DatePickerRange");
exports.DatePickerRange = DatePickerRange_1["default"];
var Autocomplete_1 = require("./models/builder/Autocomplete");
exports.Autocomplete = Autocomplete_1["default"];
var CheckboxItem_1 = require("./models/builder/CheckboxItem");
exports.CheckboxItem = CheckboxItem_1["default"];
var RangePicker_1 = require("./models/builder/RangePicker");
exports.RangePicker = RangePicker_1["default"];
var DatePicker_1 = require("./models/builder/DatePicker");
exports.DatePicker = DatePicker_1["default"];
var Checkbox_1 = require("./models/builder/Checkbox");
exports.Checkbox = Checkbox_1["default"];
var Multiple_1 = require("./models/builder/Multiple");
exports.Multiple = Multiple_1["default"];
var Upload_1 = require("./models/builder/Upload");
exports.Upload = Upload_1["default"];
var Switch_1 = require("./models/builder/Switch");
exports.Switch = Switch_1["default"];
var Slider_1 = require("./models/builder/Slider");
exports.Slider = Slider_1["default"];
var Select_1 = require("./models/builder/Select");
exports.Select = Select_1["default"];
var RadioItem_1 = require("./models/builder/RadioItem");
exports.RadioItem = RadioItem_1["default"];
var Radio_1 = require("./models/builder/Radio");
exports.Radio = Radio_1["default"];
var Input_1 = require("./models/builder/Input");
exports.Input = Input_1["default"];
var SelectItem_1 = require("./models/builder/SelectItem");
exports.SelectItem = SelectItem_1["default"];
var Typography_1 = require("./models/builder/Typography");
exports.Typography = Typography_1["default"];
var Creator_1 = require("./models/builder/Creator");
exports.Creator = Creator_1["default"];
var Drawer_1 = require("./models/builder/Drawer");
exports.Drawer = Drawer_1["default"];
var Button_1 = require("./models/builder/Button");
exports.Button = Button_1["default"];
var Search_1 = require("./models/builder/Search");
exports.Search = Search_1["default"];
var Modal_1 = require("./models/builder/Modal");
exports.Modal = Modal_1["default"];
var Title_1 = require("./models/builder/Title");
exports.Title = Title_1["default"];
var Space_1 = require("./models/builder/Space");
exports.Space = Space_1["default"];
var Sider_1 = require("./models/builder/Sider");
exports.Sider = Sider_1["default"];
var Item_1 = require("./models/builder/Item");
exports.Item = Item_1["default"];
var TreeItem_1 = require("./models/builder/TreeItem");
exports.TreeItem = TreeItem_1["default"];
var Tree_1 = require("./models/builder/Tree");
exports.Tree = Tree_1["default"];
var MenuItem_1 = require("./models/builder/MenuItem");
exports.MenuItem = MenuItem_1["default"];
var Menu_1 = require("./models/builder/Menu");
exports.Menu = Menu_1["default"];
// List
var List_1 = require("./models/list/List");
exports.List = List_1["default"];
var ListItem_1 = require("./models/list/ListItem");
exports.ListItem = ListItem_1["default"];
var ListHeader_1 = require("./models/list/ListHeader");
exports.ListHeader = ListHeader_1["default"];
var ListDraggable_1 = require("./models/list/ListDraggable");
exports.ListDraggable = ListDraggable_1["default"];
// Steps
var Steps_1 = require("./models/builder/Steps");
exports.Steps = Steps_1["default"];
var StepsItem_1 = require("./models/builder/StepsItem");
exports.StepsItem = StepsItem_1["default"];
// Condition
var Conditions_1 = require("./models/builder/Conditions");
exports.Conditions = Conditions_1["default"];
var ConditionsItem_1 = require("./models/builder/ConditionsItem");
exports.ConditionsItem = ConditionsItem_1["default"];
// Feedback
var Alert_1 = require("./models/builder/Alert");
exports.Alert = Alert_1["default"];
var Result_1 = require("./models/builder/Result");
exports.Result = Result_1["default"];
