import "./style.css";

import { createIcons, icons } from 'lucide';

import './components/pd-editor';
import './components/pd-editor-toolbar';

// Caution, this will import all the icons and bundle them.
document.addEventListener('DOMContentLoaded', () => createIcons({ 
    icons, 
    attrs: { 
        'stroke-width': '1px', 
        'width': '18', 
        'height': '18' 
    } 
}) );