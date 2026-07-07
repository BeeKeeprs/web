"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAllProducts } from "@/features/search/api/api";
import { BusinessDetail, getBusinessDetail } from "@/shared/business/api";
import { product } from "@/features/products/model/model";
import { BeeTypeFilter } from "./BeeTypeFilter";
import { ProductWithBusiness } from "@/features/search/model/model";
import { BusinessSidebar } from "./BusinessSidebar";
import { Maps } from "./Map";

// 업체 정보 타입 정의
interface BusinessInfo {
  businessId: number;
  companyName: string;
  businessAddress: string;
  phoneNumber?: string;
  businessType?: string;
  description?: string;
  registrationNumber?: string;
  representativeName?: string;
  commencementDate?: string;
  latitude?: number;
  longitude?: number;
}

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<ProductWithBusiness[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithBusiness[]
  >([]);
  const [selectedBeeType, setSelectedBeeType] = useState<string | null>(null);

  // 사이드바 관련 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  // 선택된 물품 전체 정보 저장
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithBusiness | null>(null);

  // 업체 정보 상태
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessError, setBusinessError] = useState<string | null>(null);

  // 선택된 업체 정보 조회
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!selectedBusinessId) {
        setBusinessInfo(null);
        return;
      }

      setBusinessLoading(true);
      setBusinessError(null);

      try {
        const info = await getBusinessDetail(selectedBusinessId);
        setBusinessInfo(info);
      } catch (fetchError) {
        console.error("업체 정보 조회 실패:", fetchError);
        setBusinessError("업체 정보를 불러올 수 없습니다.");
        setBusinessInfo(null);
      } finally {
        setBusinessLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [selectedBusinessId]);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchProductsWithBusinessInfo = async () => {
      try {
        const response = await getAllProducts();

        // 각 상품의 업체 정보를 병렬로 조회
        const productsWithBusiness = await Promise.allSettled(
          response.data.content.map(async (product: product) => {
            try {
              if (product.businessId) {
                const businessInfo = await getBusinessDetail(
                  product.businessId
                );
                return {
                  ...product,
                  businessAddress: businessInfo.businessAddress,
                  companyName: businessInfo.companyName,
                };
              }
              return product;
            } catch (productError) {
              console.error(
                `업체 정보 조회 실패 (businessId: ${product.businessId}):`,
                productError
              );
              return product;
            }
          })
        );

        const successfulProducts = productsWithBusiness
          .filter(
            (result): result is PromiseFulfilledResult<ProductWithBusiness> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        setAllProducts(successfulProducts);
        setFilteredProducts(successfulProducts);
      } catch (generalError) {
        console.error("상품 데이터 가져오기 실패:", generalError);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithBusinessInfo();
  }, []);

  // 벌 타입 필터링
  useEffect(() => {
    if (selectedBeeType === null) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(
        allProducts.filter((product) => product.beeType === selectedBeeType)
      );
    }
  }, [selectedBeeType, allProducts]);

  // 벌 타입 필터 핸들러
  const handleBeeTypeFilter = (beeType: string | null) => {
    setSelectedBeeType(beeType);
  };

  // 상품 클릭 시 즉시 지도 이동을 위한 데이터 설정
  const handleProductClick = (product: ProductWithBusiness) => {
    // 선택된 물품 정보 저장
    setSelectedProduct(product);

    // 기존 사이드바 관련 상태들
    setSelectedBusinessId(product.businessId);
    setSelectedProductName(product.name);
    setSelectedProductId(product.id);
    setSidebarOpen(true);
  };

  // 지도 마커 클릭 핸들러
  const handleMarkerClick = (product: ProductWithBusiness) => {
    handleProductClick(product);
  };

  // 사이드바 닫기 시 선택된 물품도 초기화
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedBusinessId(null);
    setSelectedProductName("");
    setSelectedProductId(null);
    setSelectedProduct(null);
    setBusinessInfo(null);
    setBusinessError(null);
  };

  // 주소 축약 함수
  const getShortAddress = (address?: string) => {
    if (!address) return "주소 정보 없음";

    const parts = address.split(" ");
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ${parts[2]}`;
    }
    return address.length > 15 ? address.slice(0, 15) + "···" : address;
  };

  // 스켈레톤 로더 컴포넌트
  const ProductSkeleton = () => (
    <div
      className="w-full border-b border-[#EEF2FF] px-5 py-3"
      style={{ height: "110px" }}
    >
      <div className="animate-pulse" style={{ willChange: "opacity" }}>
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-4"></div>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gray-300 rounded mr-1"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-row relative pt-20">
        {/* 검색 영역 스켈레톤 */}
        <div className="w-[20%] min-w-[300px] h-[calc(100vh-80px)] flex flex-col items-start border-r border-[#E5E7EB] relative z-20 bg-white">
          {/* 벌 타입 필터 스켈레톤 */}
          <div className="w-full p-4 border-b border-gray-200 shrink-0 h-[80px] flex items-center">
            <div className="flex gap-2 animate-pulse">
              <div className="h-8 bg-gray-300 rounded-full w-12"></div>
              <div className="h-8 bg-gray-300 rounded-full w-16"></div>
              <div className="h-8 bg-gray-300 rounded-full w-14"></div>
            </div>
          </div>

          {/* 상품 리스트 스켈레톤 */}
          <div className="w-full flex-1 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* 지도 영역 큰 콘텐츠 - LCP 우선순위 확보 */}
        <div className="w-full h-[calc(100vh-80px)] relative bg-linear-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
          {/* 대형 로고/브랜딩 콘텐츠 */}
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              상품 위치 지도
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              전국의 수정벌 상품을 지도에서 확인하세요
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>

          {/* 추가 정보 카드들 */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm text-gray-600">
                위치 기반
                <br />
                상품 검색
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🏪</div>
              <p className="text-sm text-gray-600">
                업체 정보
                <br />
                한눈에 보기
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[calc(100vh-80px-90px)] relative">
      {!isOpen && (
        <div
          className="absolute top-0 left-0 z-10 p-3 bg-yellow-400 text-white font-bold rounded-r-full shadow-lg cursor-pointer hover:bg-yellow-500 transition-colors duration-200 text-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          상품 목록 보기
        </div>
      )}

      {/* 검색 영역 */}
      {isOpen && (
        <div className="min-w-full h-[calc(100vh-80px)] flex flex-col items-start border-r border-[#E5E7EB] relative z-20 bg-white">
          {isOpen && (
            <div
              className="absolute top-0 right-0 px-4 py-1  cursor-pointer text-3xl hover:bg-gray-100 rounded-full "
              onClick={() => setIsOpen(false)} // 닫기 클릭 시 false로
            >
              x
            </div>
          )}
          {/* 벌 타입 필터 */}
          <BeeTypeFilter
            selectedBeeType={selectedBeeType}
            onBeeTypeChange={handleBeeTypeFilter}
          />
          {/* 상품 리스트 */}

          <div className="w-full flex-1 overflow-y-auto scrollbar-hide">
            {filteredProducts.length === 0 ? (
              <div className="w-full h-[200px] flex flex-col items-center justify-center">
                <p className="text-gray-500">검색된 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`w-full border-b border-[#EEF2FF] flex flex-col justify-between px-5 py-3 cursor-pointer transition-colors ${
                      selectedProductId === product.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      minHeight: "110px",
                      maxHeight: "110px",
                      height: "110px",
                    }}
                    onClick={() => handleProductClick(product)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${product.name} 상품 선택`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProductClick(product);
                      }
                    }}
                  >
                    <div className="flex flex-row justify-between items-center flex-1">
                      <p className="text-[#333333] font-medium text-base leading-tight mb-1 overflow-hidden text-ellipsis">
                        {product.name.length > 15
                          ? product.name.slice(0, 15) + "···"
                          : product.name}
                      </p>
                      <p
                        className="text-[#6B7280] font-medium text-lg shrink-0"
                        aria-hidden="true"
                      >
                        &gt;
                      </p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row items-center min-w-0 flex-1">
                        <Image
                          src="/Location.svg"
                          alt="위치 아이콘"
                          width={12}
                          height={12}
                          className="mr-1 shrink-0"
                          style={{
                            width: "12px",
                            height: "12px",
                            aspectRatio: "1",
                          }}
                          loading="lazy"
                          priority={false}
                        />
                        <p className="text-[#6B7280] text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {getShortAddress(product.businessAddress)}
                        </p>
                      </div>
                      <p className="text-[#6B7280] text-xs shrink-0 ml-2">
                        업체정보
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 지도 */}
      {!isOpen && (
        <div className="w-full h-full relative">
          <Maps
            products={filteredProducts}
            selectedProductId={selectedProductId}
            selectedProduct={selectedProduct}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      )}

      {/* 업체 정보 사이드바 */}
      {sidebarOpen && (
        <BusinessSidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          businessInfo={businessInfo as BusinessDetail | null}
          isLoading={businessLoading}
          error={businessError}
          productName={selectedProductName}
          productId={selectedProductId}
          selectedBusinessId={selectedBusinessId}
        />
      )}
    </div>
  );
}
