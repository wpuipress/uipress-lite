import { defineAsyncComponent } from "vue";

// Import layout blocks
import Container from "@/js/uip/blocks/layout/container/index.js";
import Dropdown from "@/js/uip/blocks/layout/dropdown/index.js";
import OffCanvas from "@/js/uip/blocks/layout/offcanvas/index.js";
import Modal from "@/js/uip/blocks/layout/modal/index.js";

// Import analytics blocks
import GoogleAnalytics from "@/js/uip/blocks/analytics/uip-google-analytics/index.js";
import GoogleAnalyticsMap from "@/js/uip/blocks/analytics/uip-google-analytics-map/index.js";
import GoogleAnalyticsTables from "@/js/uip/blocks/analytics/uip-google-analytics-tables/index.js";
import GoogleAnalyticsRealtime from "@/js/uip/blocks/analytics/uip-google-realtime/index.js";

// Import Dynamic blocks
import AminMenu from "@/js/uip/blocks/dynamic/admin-menu/index.js";
import AiChat from "@/js/uip/blocks/dynamic/ai-chat/index.js";
import BreadCrumbs from "@/js/uip/blocks/dynamic/breadcrumbs/index.js";
import PageContent from "@/js/uip/blocks/dynamic/page-content/index.js";
import FullScreen from "@/js/uip/blocks/dynamic/fullscreen/index.js";
import MenuCollapse from "@/js/uip/blocks/dynamic/menu-collapse/index.js";
import PageLoader from "@/js/uip/blocks/dynamic/page-loader/index.js";
import PostsTable from "@/js/uip/blocks/dynamic/posts-table/index.js";
import RecentPosts from "@/js/uip/blocks/dynamic/recent-posts/index.js";
import Search from "@/js/uip/blocks/dynamic/search/index.js";
import ToolBar from "@/js/uip/blocks/dynamic/toolbar/index.js";
import MediaLibrary from "@/js/uip/blocks/dynamic/media-library/index.js";
import PluginUpdates from "@/js/uip/blocks/dynamic/plugin-updates/index.js";
import PluginSearch from "@/js/uip/blocks/dynamic/plugin-search/index.js";
import GroupedDateRange from "@/js/uip/blocks/dynamic/grouped-date-range/index.js";
import ContentNavigator from "@/js/uip/blocks/dynamic/content-navigator/index.js";
import OrdersKanban from "@/js/uip/blocks/dynamic/orders-kanban/index.js";
import SiteNotifications from "@/js/uip/blocks/dynamic/site-notifications/index.js";

// Import element blocks
import Accordion from "@/js/uip/blocks/elements/accordion/index.js";
import Button from "@/js/uip/blocks/elements/button/index.js";
import DarkModeToggle from "@/js/uip/blocks/elements/dark-mode-toggle/index.js";
import Heading from "@/js/uip/blocks/elements/heading/index.js";
import Icon from "@/js/uip/blocks/elements/icon/index.js";
import Image from "@/js/uip/blocks/elements/image/index.js";
import Paragraph from "@/js/uip/blocks/elements/paragraph/index.js";
import Quote from "@/js/uip/blocks/elements/quote/index.js";
import Tabs from "@/js/uip/blocks/elements/tabs/index.js";
import ToDoList from "@/js/uip/blocks/elements/todo-list/index.js";
import Video from "@/js/uip/blocks/elements/video/index.js";
import Iframe from "@/js/uip/blocks/elements/iframe/index.js";
import HTMLblock from "@/js/uip/blocks/elements/html/index.js";
import IconList from "@/js/uip/blocks/elements/icon-list/index.js";
import ShortCode from "@/js/uip/blocks/elements/shortcode/index.js";

// Import input blocks
import FormBlock from "@/js/uip/blocks/inputs/form/index.js";
import Select from "@/js/uip/blocks/inputs/select-input/index.js";
import TextArea from "@/js/uip/blocks/inputs/text-area/index.js";
import TextInput from "@/js/uip/blocks/inputs/text-input/index.js";
import Radio from "@/js/uip/blocks/inputs/radio/index.js";
import CheckBox from "@/js/uip/blocks/inputs/checkbox/index.js";
import ImageSelect from "@/js/uip/blocks/inputs/image-select/index.js";
import DateRange from "@/js/uip/blocks/inputs/date-range/index.js";
import ColorSelect from "@/js/uip/blocks/inputs/color-select/index.js";

// Store analytics
import WooCharts from "@/js/uip/blocks/storeanalytics/wc-charts/index.js";
import WooMap from "@/js/uip/blocks/storeanalytics/wc-map/index.js";
import WooTables from "@/js/uip/blocks/storeanalytics/wc-tables/index.js";

export const registerCoreBlocks = () => {
  return [
    Container,
    Dropdown,
    OffCanvas,
    Modal,
    GoogleAnalytics,
    GoogleAnalyticsMap,
    GoogleAnalyticsTables,
    GoogleAnalyticsRealtime,
    AminMenu,
    AiChat,
    BreadCrumbs,
    PageContent,
    FullScreen,
    MenuCollapse,
    PageLoader,
    PostsTable,
    RecentPosts,
    Search,
    ToolBar,
    MediaLibrary,
    PluginUpdates,
    PluginSearch,
    GroupedDateRange,
    ContentNavigator,
    OrdersKanban,
    SiteNotifications,
    Accordion,
    Button,
    DarkModeToggle,
    Heading,
    Icon,
    Image,
    Paragraph,
    Quote,
    Tabs,
    ToDoList,
    Video,
    Iframe,
    HTMLblock,
    IconList,
    ShortCode,
    FormBlock,
    Select,
    TextArea,
    TextInput,
    Radio,
    CheckBox,
    ImageSelect,
    DateRange,
    ColorSelect,
    WooCharts,
    WooMap,
    WooTables,
  ];
};
