import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Redirecting from './Redirecting';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="OpeningFlashcard" element={<Redirecting />} />
        </Routes>
    </BrowserRouter>
);
