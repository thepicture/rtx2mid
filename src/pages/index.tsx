import { lazy } from 'react';

import { Route, Routes, Navigate } from 'react-router-dom';

const Rtx2MidConverterPage = lazy(() => import('./rtx2midconverter'));
const Rtx2RtttlConverterPage = lazy(() => import('./rtx2rtttlconverter'));
const HomePage = lazy(() => import('./home'));

export const Routing = () => {
    return (
        <Routes>
            <Route path="/rtx2mid" element={<Rtx2MidConverterPage />} />
            <Route path="/rtx2rtttl" element={<Rtx2RtttlConverterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
    );
};
