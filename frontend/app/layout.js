import './globals.css';

export const metadata = {
	title: 'QueryBridge',
	description: 'Single page QueryBridge app',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-white text-gray-900">
				{children}
			</body>
		</html>
	);
}
