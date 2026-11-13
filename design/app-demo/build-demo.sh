#!/bin/bash
cd "$(dirname "$0")"
rm -rf dist
EXPO_PUBLIC_BASE_URL="https://demo.invalid/price" EXPO_PUBLIC_KAKAO_MAP_API_KEY= EXPO_PUBLIC_KAKAO_MAP_WEB_BASE_URL= EXPO_PUBLIC_KAKAO_REST_API_KEY= EXPO_PUBLIC_KMA_API_KEY= EXPO_PUBLIC_NAVER_CLIENT_ID= EXPO_PUBLIC_NAVER_CLIENT_SECRET= EXPO_PUBLIC_NONGSARO_API_KEY=demo EXPO_PUBLIC_NONGSARO_BASE_URL=https://demo.invalid/nongsaro EXPO_PUBLIC_SERVICE_KEY=demo CI=1 npx expo export -p web --output-dir dist > build.log 2>&1
echo "exit $?" >> build.log
