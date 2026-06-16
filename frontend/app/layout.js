import './globals.css';

export const metadata = {
	title: 'QueryBridge',
	description: 'Single page QueryBridge app',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-50 text-gray-900">
				<div className="max-w-4xl mx-auto p-6">{children}</div>


			</body>
		</html>
	);
}
