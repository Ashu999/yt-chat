export default function Header() {
	return (
		<header className="p-4 bg-red-600 text-white">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">YouTube Chat</h1>
				<a
					href="https://github.com/ashu-lv/yt-chat"
					target="_blank"
					rel="noopener noreferrer"
					className="text-white hover:text-red-200 transition-colors"
				>
					GitHub
				</a>
			</div>
		</header>
	);
}
