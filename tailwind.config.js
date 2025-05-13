/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                aurora: {
                    violet: '#3A1C71',
                    rose: '#D76D77',
                    orange: '#FFAF7B',
                    purple: '#8E2DE2',
                    pink: '#FF6CAB',
                },
                background: {
                    dark: '#121212',
                    deeper: '#231E3D',
                    darkest: '#0A0A0A',
                    light: '#ECEFF1',
                    lighter: '#F8FAFC',
                },
                accent: {
                    violet: '#7F00FF',
                    cyan: '#00E5FF',
                    purple: '#B388FF',
                    teal: '#1DE9B6',
                    gold: '#FFD700',
                },
                text: {
                    light: '#EAEAEA',
                    dark: '#212121',
                    muted: '#9E9E9E',
                    accent: '#B388FF',
                    link: '#00E5FF',
                },
                panel: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    medium: 'rgba(255, 255, 255, 0.1)',
                    highlight: 'rgba(255, 255, 255, 0.15)',
                    glass: 'rgba(255, 255, 255, 0.03)',
                    card: 'rgba(36, 36, 58, 0.7)',
                },
                status: {
                    success: '#00C853',
                    warning: '#FFD600',
                    error: '#FF1744',
                    info: '#2979FF',
                },
            },
            backgroundImage: {
                'aurora-gradient': 'linear-gradient(to right, #3A1C71, #D76D77, #FFAF7B)',
                'aurora-gradient-vertical': 'linear-gradient(to bottom, #3A1C71, #D76D77, #FFAF7B)',
                'aurora-gradient-diagonal': 'linear-gradient(to bottom right, #3A1C71, #D76D77, #FFAF7B)',
                'cosmic-gradient': 'linear-gradient(to right, #434343, #000000)',
                'ocean-gradient': 'linear-gradient(to right, #2E3192, #1BFFFF)',
                'violet-cyan-gradient': 'linear-gradient(to right, #7F00FF, #00E5FF)',
                'purple-pink-gradient': 'linear-gradient(to right, #8E2DE2, #FF6CAB)',
                'twilight-gradient': 'linear-gradient(135deg, #231E3D 0%, #3A1C71 100%)',
            },
            boxShadow: {
                'accent-violet': '0 0 15px rgba(127, 0, 255, 0.5)',
                'accent-cyan': '0 0 15px rgba(0, 229, 255, 0.5)',
                'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
                'hard': '0 8px 30px rgba(0, 0, 0, 0.15)',
                'inner-glow': 'inset 0 0 20px rgba(127, 0, 255, 0.2)',
                'button': '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                'button-hover': '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                'button-active': '0 2px 4px rgba(50, 50, 93, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
                'card': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            borderWidth: {
                '1': '1px',
                '3': '3px',
                '5': '5px',
            },
            borderRadius: {
                'xs': '2px',
                'pill': '9999px',
            },
            opacity: {
                '5': '0.05',
                '15': '0.15',
                '85': '0.85',
                '95': '0.95',
            },
            keyframes: {
                'pulse-subtle': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.8 },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'glow': {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(127, 0, 255, 0.5)' },
                    '50%': { boxShadow: '0 0 25px rgba(127, 0, 255, 0.8)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-in-left': {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-in-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-in-down': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'spin': {
                    'to': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease forwards',
                'fade-out': 'fade-out 0.5s ease forwards',
                'slide-in-right': 'slide-in-right 0.5s ease forwards',
                'slide-in-left': 'slide-in-left 0.5s ease forwards',
                'slide-in-up': 'slide-in-up 0.5s ease forwards',
                'slide-in-down': 'slide-in-down 0.5s ease forwards',
                'spin': 'spin 1s linear infinite',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Lexend', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            zIndex: {
                '-10': '-10',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
            spacing: {
                '72': '18rem',
                '80': '20rem',
                '96': '24rem',
                '128': '32rem',
            },
            screens: {
                '3xl': '1792px',
            },
        },
    },
    plugins: [
        // Text shadow plugin
        function({ addUtilities }) {
            addUtilities({
                '.text-shadow-glow-violet': {
                    'text-shadow': '0 0 8px rgba(127, 0, 255, 0.8)',
                },
                '.text-shadow-glow-cyan': {
                    'text-shadow': '0 0 8px rgba(0, 229, 255, 0.8)',
                },
                '.text-shadow-glow-white': {
                    'text-shadow': '0 0 8px rgba(255, 255, 255, 0.8)',
                },
                '.text-shadow-glow-subtle': {
                    'text-shadow': '0 0 2px rgba(255, 255, 255, 0.5)',
                },
                '.text-shadow-contrast': {
                    'text-shadow': '0 1px 3px rgba(0, 0, 0, 0.6)',
                },
                '.text-shadow-none': {
                    'text-shadow': 'none',
                },
            }, ['responsive', 'hover', 'dark']);
        },

        // Backdrop filter plugin
        function({ addUtilities }) {
            addUtilities({
                '.backdrop-blur-xs': {
                    'backdrop-filter': 'blur(2px)',
                },
                '.backdrop-blur-sm': {
                    'backdrop-filter': 'blur(4px)',
                },
                '.backdrop-blur': {
                    'backdrop-filter': 'blur(8px)',
                },
                '.backdrop-blur-md': {
                    'backdrop-filter': 'blur(12px)',
                },
                '.backdrop-blur-lg': {
                    'backdrop-filter': 'blur(16px)',
                },
                '.backdrop-blur-xl': {
                    'backdrop-filter': 'blur(24px)',
                },
                '.backdrop-blur-2xl': {
                    'backdrop-filter': 'blur(40px)',
                },
                '.backdrop-blur-none': {
                    'backdrop-filter': 'none',
                },
            }, ['responsive', 'hover']);
        },

        // Component plugins
        function({ addComponents, theme }) {
            // Glass morphism component
            addComponents({
                '.glass': {
                    'background': 'rgba(255, 255, 255, 0.05)',
                    'backdrop-filter': 'blur(8px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                    'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                },
                '.glass-dark': {
                    'background': 'rgba(10, 10, 10, 0.6)',
                    'backdrop-filter': 'blur(8px)',
                    'border': '1px solid rgba(255, 255, 255, 0.05)',
                    'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                },
                '.glass-card': {
                    'background': 'rgba(255, 255, 255, 0.08)',
                    'backdrop-filter': 'blur(12px)',
                    'border-radius': theme('borderRadius.lg'),
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                    'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                },
            });

            // Button components
            addComponents({
                '.btn': {
                    'display': 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'font-weight': theme('fontWeight.medium'),
                    'transition-property': 'all',
                    'transition-duration': '150ms',
                    'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
                    'cursor': 'pointer',
                    'outline': 'none',
                    'user-select': 'none',
                    'padding': '0.625rem 1rem',
                    'font-size': theme('fontSize.base'),
                    'line-height': theme('lineHeight.5'),
                    'border-radius': theme('borderRadius.md'),
                },
                '.btn-disabled': {
                    'cursor': 'not-allowed',
                    'pointer-events': 'none',
                    'opacity': '0.65',
                },
                '.btn-xs': {
                    'padding': '0.25rem 0.5rem',
                    'font-size': theme('fontSize.xs'),
                    'line-height': theme('lineHeight.4'),
                    'border-radius': theme('borderRadius.xs'),
                },
                '.btn-sm': {
                    'padding': '0.5rem 0.75rem',
                    'font-size': theme('fontSize.sm'),
                    'line-height': theme('lineHeight.5'),
                    'border-radius': theme('borderRadius.sm'),
                },
                '.btn-lg': {
                    'padding': '0.75rem 1.5rem',
                    'font-size': theme('fontSize.lg'),
                    'line-height': theme('lineHeight.7'),
                    'border-radius': theme('borderRadius.lg'),
                },
                '.btn-primary': {
                    'background-color': '#7F00FF',
                    'color': '#FFFFFF',
                    'box-shadow': theme('boxShadow.button'),
                },
                '.btn-primary-hover': {
                    'background-color': '#9500FF',
                    'box-shadow': theme('boxShadow.button-hover'),
                    'transform': 'translateY(-1px)',
                },
                '.btn-primary-active': {
                    'background-color': '#6A00D6',
                    'box-shadow': theme('boxShadow.button-active'),
                    'transform': 'translateY(0)',
                },
                '.btn-secondary': {
                    'background-color': '#00E5FF',
                    'color': '#212121',
                    'box-shadow': theme('boxShadow.button'),
                },
                '.btn-secondary-hover': {
                    'background-color': '#33EAFF',
                    'box-shadow': theme('boxShadow.button-hover'),
                    'transform': 'translateY(-1px)',
                },
                '.btn-danger': {
                    'background-color': '#FF5252',
                    'color': '#FFFFFF',
                    'box-shadow': theme('boxShadow.button'),
                },
                '.btn-success': {
                    'background-color': '#1DE9B6',
                    'color': '#212121',
                    'box-shadow': theme('boxShadow.button'),
                },
                '.btn-glass': {
                    'background-color': 'rgba(255, 255, 255, 0.1)',
                    'backdrop-filter': 'blur(12px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                    'color': '#EAEAEA',
                    'box-shadow': theme('boxShadow.glass'),
                },
                '.btn-gradient': {
                    'background-image': 'linear-gradient(to right, #7F00FF, #00E5FF)',
                    'color': '#FFFFFF',
                    'box-shadow': theme('boxShadow.button'),
                    'background-size': '200% auto',
                    'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.btn-loading': {
                    'position': 'relative',
                    'pointer-events': 'none',
                    'color': 'transparent !important',
                },
                '.btn-loading-spin': {
                    'content': '""',
                    'position': 'absolute',
                    'width': '1em',
                    'height': '1em',
                    'top': '50%',
                    'left': '50%',
                    'margin': '-0.5em 0 0 -0.5em',
                    'border-radius': '50%',
                    'border': '0.15em solid currentColor',
                    'border-top-color': 'transparent',
                    'animation': 'spin 0.6s linear infinite',
                },
            });

            // Form components
            addComponents({
                '.form-input': {
                    'appearance': 'none',
                    'background-color': 'rgba(255, 255, 255, 0.05)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                    'border-radius': theme('borderRadius.md'),
                    'color': '#EAEAEA',
                    'display': 'block',
                    'font-size': theme('fontSize.base'),
                    'line-height': theme('lineHeight.normal'),
                    'padding': '0.625rem 0.75rem',
                    'transition': 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    'width': '100%',
                },
                '.form-input-focus': {
                    'outline': 'none',
                    'border-color': '#7F00FF',
                    'box-shadow': '0 0 0 2px rgba(127, 0, 255, 0.3)',
                },
                '.form-error': {
                    'border-color': '#FF1744',
                },
                '.error-message': {
                    'color': '#FF1744',
                    'font-size': theme('fontSize.sm'),
                    'margin-top': '0.25rem',
                },
            });

            // Card components
            addComponents({
                '.card': {
                    'background-color': '#231E3D',
                    'border-radius': theme('borderRadius.lg'),
                    'overflow': 'hidden',
                    'box-shadow': theme('boxShadow.card'),
                },
                '.card-header': {
                    'padding': '1rem',
                    'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
                },
                '.card-body': {
                    'padding': '1rem',
                },
                '.card-footer': {
                    'padding': '1rem',
                    'border-top': '1px solid rgba(255, 255, 255, 0.1)',
                },
            });

            // Badge components
            addComponents({
                '.badge': {
                    'display': 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'padding': '0.25rem 0.5rem',
                    'border-radius': theme('borderRadius.full'),
                    'font-size': theme('fontSize.xs'),
                    'font-weight': theme('fontWeight.medium'),
                    'line-height': '1',
                },
                '.badge-primary': {
                    'background-color': '#7F00FF',
                    'color': '#FFFFFF',
                },
                '.badge-secondary': {
                    'background-color': '#00E5FF',
                    'color': '#212121',
                },
                '.badge-success': {
                    'background-color': '#00C853',
                    'color': '#FFFFFF',
                },
                '.badge-warning': {
                    'background-color': '#FFD600',
                    'color': '#212121',
                },
                '.badge-danger': {
                    'background-color': '#FF1744',
                    'color': '#FFFFFF',
                },
            });

            // Alert components
            addComponents({
                '.alert': {
                    'position': 'relative',
                    'padding': '0.75rem 1rem',
                    'margin-bottom': '1rem',
                    'border-radius': theme('borderRadius.md'),
                },
                '.alert-primary': {
                    'background-color': 'rgba(58, 28, 113, 0.2)',
                    'border-left': '4px solid #3A1C71',
                    'color': '#EAEAEA',
                },
                '.alert-danger': {
                    'background-color': 'rgba(255, 23, 68, 0.2)',
                    'border-left': '4px solid #FF1744',
                    'color': '#FF5252',
                },
                '.alert-success': {
                    'background-color': 'rgba(0, 200, 83, 0.2)',
                    'border-left': '4px solid #00C853',
                    'color': '#00E676',
                },
                '.alert-warning': {
                    'background-color': 'rgba(255, 214, 0, 0.2)',
                    'border-left': '4px solid #FFD600',
                    'color': '#FFEA00',
                },
            });

            // Spinner components
            addComponents({
                '.spinner': {
                    'display': 'inline-block',
                    'width': '2rem',
                    'height': '2rem',
                    'border': '4px solid rgba(255, 255, 255, 0.1)',
                    'border-radius': '50%',
                    'border-top-color': '#7F00FF',
                    'animation': 'spin 0.8s linear infinite',
                },
                '.spinner-sm': {
                    'width': '1rem',
                    'height': '1rem',
                    'border-width': '2px',
                },
                '.spinner-lg': {
                    'width': '3rem',
                    'height': '3rem',
                    'border-width': '6px',
                },
            });

            // Navbar components
            addComponents({
                '.navbar': {
                    'display': 'flex',
                    'flex-wrap': 'wrap',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    'padding': '1rem 1.5rem',
                },
                '.navbar-glass': {
                    'backdrop-filter': 'blur(12px)',
                    'background-color': 'rgba(10, 10, 14, 0.8)',
                    'border-bottom': '1px solid rgba(255, 255, 255, 0.05)',
                },
            });
        },

        // Utility plugins
        function({ addUtilities }) {
            // Dark mode utilities
            addUtilities({
                '.dark-mode': {
                    'background-color': '#121212',
                    'color': '#EAEAEA',
                },
                '.light-mode': {
                    'background-color': '#ECEFF1',
                    'color': '#212121',
                },
            }, ['responsive']);

            // Grid utilities
            addUtilities({
                '.grid-auto-fit': {
                    'display': 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(250px, 1fr))',
                    'gap': '1rem',
                },
                '.grid-auto-fit-sm': {
                    'display': 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))',
                    'gap': '1rem',
                },
                '.grid-auto-fit-lg': {
                    'display': 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(350px, 1fr))',
                    'gap': '1rem',
                },
            }, ['responsive']);

            // Typography utilities
            addUtilities({
                '.text-fluid-base': {
                    'font-size': 'clamp(0.875rem, 2vw, 1rem)',
                },
                '.text-fluid-lg': {
                    'font-size': 'clamp(1rem, 2.5vw, 1.25rem)',
                },
                '.text-fluid-xl': {
                    'font-size': 'clamp(1.25rem, 3vw, 1.5rem)',
                },
                '.text-fluid-2xl': {
                    'font-size': 'clamp(1.5rem, 4vw, 2rem)',
                },
                '.heading-1': {
                    'font-size': 'clamp(2.5rem, 8vw, 4rem)',
                    'font-weight': '700',
                    'line-height': '1.2',
                    'margin-bottom': '1.5rem',
                },
                '.heading-2': {
                    'font-size': 'clamp(2rem, 6vw, 3rem)',
                    'font-weight': '700',
                    'line-height': '1.2',
                    'margin-bottom': '1rem',
                },
                '.heading-3': {
                    'font-size': 'clamp(1.5rem, 4vw, 2.25rem)',
                    'font-weight': '600',
                    'line-height': '1.2',
                    'margin-bottom': '0.75rem',
                },
            });

            // Scrollbar utilities
            addUtilities({
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                    'scrollbar-color': 'rgba(255, 255, 255, 0.1) #121212',
                    '&::-webkit-scrollbar': {
                        'width': '4px',
                        'height': '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        'background': '#121212',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        'background': 'rgba(255, 255, 255, 0.1)',
                        'border-radius': '9999px',
                    },
                },
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        'display': 'none',
                    },
                },
            });
        },
    ],
}