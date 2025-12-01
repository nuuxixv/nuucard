
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function KakaoScript() {
    const onLoad = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
            if (key) {
                window.Kakao.init(key);
                console.log('Kakao SDK initialized');
            } else {
                console.warn('Kakao JS Key is missing in environment variables.');
            }
        }
    };

    return (
        <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
            integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
            crossOrigin="anonymous"
            onLoad={onLoad}
        />
    );
}
