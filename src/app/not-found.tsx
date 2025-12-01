
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center text-[#3E3A36] p-4 text-center font-sans">
            <h1 className="text-9xl font-bold text-[#C43E38]/20 select-none">404</h1>
            <div className="absolute">
                <h2 className="text-3xl font-medium mb-4">길을 잃으셨나요?</h2>
                <p className="text-gray-500 mb-8">찾으시는 페이지가 존재하지 않거나<br />삭제되었을 수 있습니다.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-[#3E3A36] text-white rounded-full hover:bg-black transition-colors shadow-lg"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
