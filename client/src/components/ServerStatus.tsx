interface ServerStatusProps {
	healthData: { Hello: string } | undefined;
	itemData: { item_id: number; q: string | null } | undefined;
}

export function ServerStatus({ healthData, itemData }: ServerStatusProps) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">
				Server Connection Status
			</h2>
			<div className="space-y-3">
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 bg-green-500 rounded-full" />
					<span className="text-gray-700">
						Server Health: {healthData?.Hello}
					</span>
				</div>
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 bg-blue-500 rounded-full" />
					<span className="text-gray-700">
						Test Item: ID {itemData?.item_id}, Query: {itemData?.q || "none"}
					</span>
				</div>
			</div>
		</div>
	);
}
