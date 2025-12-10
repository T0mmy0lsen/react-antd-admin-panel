import Main from './main';

import Mapping from './utils/Mapping';
import Helpers from './utils/Helpers';
import Access from './utils/Access';

import Formula from './models/Formula';
import Action from './models/Action';
import Cycle from './models/Cycle';
import Value from './models/Value';
import Route from './models/Route';
import Post from './models/Post';
import Path from './models/Path';
import Get from './models/Get';

import Default from './models/builder/Default';
import Section from './models/builder/Section';

import DatePickerToggle from './models/builder/DatePickerToggle';
import DatePickerRange from './models/builder/DatePickerRange';
import Autocomplete from './models/builder/Autocomplete';
import CheckboxItem from './models/builder/CheckboxItem';
import RangePicker from './models/builder/RangePicker';
import DatePicker from './models/builder/DatePicker';
import Selections from './models/builder/Selections';
import Selection from './models/builder/Selection';
import RadioItem from './models/builder/RadioItem';
import Checkbox from './models/builder/Checkbox';
import Multiple from './models/builder/Multiple';
import Carousel from './models/builder/Carousel';
import Upload from './models/builder/Upload';
import Switch from './models/builder/Switch';
import Slider from './models/builder/Slider';

import Select from './models/builder/Select';
import Radio from './models/builder/Radio';
import Input from './models/builder/Input';

import SelectItem from './models/builder/SelectItem';
import Typography from './models/builder/Typography';
import Creator from './models/builder/Creator';
import Drawer from './models/builder/Drawer';
import Button from './models/builder/Button';
import Search from './models/builder/Search';
import Modal from './models/builder/Modal';
import Title from './models/builder/Title';
import Space from './models/builder/Space';
import Sider from './models/builder/Sider';
import Item from './models/builder/Item';

import ItemValue from './models/builder/ItemValue';

import TreeItem from './models/builder/TreeItem';
import Tree from './models/builder/Tree';

import MenuItem from './models/builder/MenuItem';
import Menu from './models/builder/Menu';

// List
import List from './models/list/List';
import ListItem from './models/list/ListItem';
import ListHeader from './models/list/ListHeader';
import ListDraggable from './models/list/ListDraggable';

// Steps
import Steps from './models/builder/Steps';
import StepsItem from './models/builder/StepsItem';

// Condition
import Conditions from './models/builder/Conditions';
import ConditionsItem from './models/builder/ConditionsItem';

// Feedback
import Alert from './models/builder/Alert';
import Result from './models/builder/Result';

function debounce(func: any, wait: any, immediate: any) {

    let timeout: any, args: any, context: any, timestamp: any, result: any;
    if (null == wait) wait = 100;

    function later() {
        let last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
            }
        }
    }

    let debounced = function () {
        // @ts-ignore
        context = this;
        args = arguments;
        timestamp = Date.now();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
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

export {
    DatePickerToggle,
    DatePickerRange,
    ConditionsItem,
    ListDraggable,
    Autocomplete,
    CheckboxItem,
    RangePicker,
    ListHeader,
    DatePicker,
    SelectItem,
    Typography,
    Conditions,
    Selections,
    StepsItem,
    RadioItem,
    Selection,
    Checkbox,
    TreeItem,
    Carousel,
    ListItem,
    Multiple,
    MenuItem,
    Section,
    Mapping,
    Helpers,
    Formula,
    Default,
    Creator,
    Slider,
    Action,
    Access,
    Switch,
    Select,
    Upload,
    Drawer,
    Button,
    Search,
    Result,
    Cycle,
    Value,
    Route,
    Input,
    Modal,
    Title,
    Space,
    Sider,
    Radio,
    Steps,
    Alert,
    Post,
    Path,
    Main,
    Tree,
    List,
    Menu,
    Item,
    ItemValue,
    Get,
    debounce
}