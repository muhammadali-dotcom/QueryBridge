module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				lg: '1100px',
			},
		},
		extend: {
			colors: {
				emerald: 'var(--color-emerald)',
				'deep-pine': 'var(--color-deep-pine)',
				'taxi-gold': 'var(--color-taxi-gold)',
				mist: 'var(--color-mist)',
				ink: 'var(--color-ink)',
			},
			boxShadow: {
				soft: '0 10px 30px rgba(16,24,40,0.06)',
			},
		},
	},
	plugins: [],
};
