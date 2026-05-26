import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widgets/widget-task-handler';

import App from './App';

registerWidgetTaskHandler(widgetTaskHandler);
registerRootComponent(App);
