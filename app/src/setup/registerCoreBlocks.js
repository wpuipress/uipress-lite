import { defineAsyncComponent } from "vue";

// Import layout blocks
import Container from "@/blocks/layout/container/index.js";
import ResponsiveGrid from "@/blocks/layout/responsive-grid-old/index.js";
import Dropdown from "@/blocks/layout/dropdown/index.js";
import OffCanvas from "@/blocks/layout/offcanvas/index.js";
import Modal from "@/blocks/layout/modal/index.js";

// Import analytics blocks
import GoogleAnalytics from "@/blocks/analytics/uip-google-analytics/index.js";
import GoogleAnalyticsMap from "@/blocks/analytics/uip-google-analytics-map/index.js";
import GoogleAnalyticsTables from "@/blocks/analytics/uip-google-analytics-tables/index.js";
import GoogleAnalyticsRealtime from "@/blocks/analytics/uip-google-realtime/index.js";

// Import Dynamic blocks
import AdminMenu from "@/blocks/dynamic/admin-menu/index.js";
import AdminMenuOld from "@/blocks/dynamic/admin-menu-old/index.js";

import AiChat from "@/blocks/dynamic/ai-chat/index.js";
import BreadCrumbs from "@/blocks/dynamic/breadcrumbs/index.js";
import PageContent from "@/blocks/dynamic/page-content/index.js";
import FullScreen from "@/blocks/dynamic/fullscreen/index.js";
import MenuCollapse from "@/blocks/dynamic/menu-collapse/index.js";
import PageLoader from "@/blocks/dynamic/page-loader/index.js";
import PostsTable from "@/blocks/dynamic/posts-table/index.js";
import RecentPosts from "@/blocks/dynamic/recent-posts/index.js";
import Search from "@/blocks/dynamic/search/index.js";
import ToolBar from "@/blocks/dynamic/toolbar/index.js";
import MediaLibrary from "@/blocks/dynamic/media-library/index.js";
import PluginUpdates from "@/blocks/dynamic/plugin-updates/index.js";
import PluginSearch from "@/blocks/dynamic/plugin-search/index.js";
import GroupedDateRange from "@/blocks/dynamic/grouped-date-range/index.js";
import ContentNavigator from "@/blocks/dynamic/content-navigator/index.js";
import OrdersKanban from "@/blocks/dynamic/orders-kanban/index.js";
import SiteNotifications from "@/blocks/dynamic/site-notifications/index.js";

// Import element blocks
import Accordion from "@/blocks/elements/accordion/index.js";
import Button from "@/blocks/elements/button/index.js";
import DarkModeToggle from "@/blocks/elements/dark-mode-toggle/index.js";
import Heading from "@/blocks/elements/heading/index.js";
import Icon from "@/blocks/elements/icon/index.js";
import Image from "@/blocks/elements/image/index.js";
import Paragraph from "@/blocks/elements/paragraph/index.js";
import Quote from "@/blocks/elements/quote/index.js";
import Tabs from "@/blocks/elements/tabs/index.js";
import ToDoList from "@/blocks/elements/todo-list/index.js";
import Video from "@/blocks/elements/video/index.js";
import Iframe from "@/blocks/elements/iframe/index.js";
import HTMLblock from "@/blocks/elements/html/index.js";
import IconList from "@/blocks/elements/icon-list/index.js";
import ShortCode from "@/blocks/elements/shortcode/index.js";

// Import input blocks
import FormBlock from "@/blocks/inputs/form/index.js";
import Select from "@/blocks/inputs/select-input/index.js";
import TextArea from "@/blocks/inputs/text-area/index.js";
import TextInput from "@/blocks/inputs/text-input/index.js";
import Radio from "@/blocks/inputs/radio/index.js";
import CheckBox from "@/blocks/inputs/checkbox/index.js";
import ImageSelect from "@/blocks/inputs/image-select/index.js";
import DateRange from "@/blocks/inputs/date-range/index.js";
import ColorSelect from "@/blocks/inputs/color-select/index.js";

// Store analytics
import WooCharts from "@/blocks/storeanalytics/wc-charts/index.js";
import WooMap from "@/blocks/storeanalytics/wc-map/index.js";
import WooTables from "@/blocks/storeanalytics/wc-tables/index.js";

export const registerCoreBlocks = () => {
  let allBlocks = [
    Container,
    ResponsiveGrid,
    Dropdown,
    OffCanvas,
    Modal,
    GoogleAnalytics,
    GoogleAnalyticsMap,
    GoogleAnalyticsTables,
    GoogleAnalyticsRealtime,
    AdminMenu,
    AdminMenuOld,
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

  return allBlocks;
};
