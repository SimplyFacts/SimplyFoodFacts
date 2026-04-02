import '@expo/metro-runtime';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import App from './entrypoint';
import './src/__create/polyfills';

renderRootComponent(App);
