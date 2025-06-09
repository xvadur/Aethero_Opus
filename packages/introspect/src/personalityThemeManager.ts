export interface PersonalityProfile {
    mbti?: string;
    temperament?: string;
}

export interface PersonalityTheme {
    colorPalette: string;
    typography: string;
    animationStyle: string;
    llmTone: string;
}

//# AETH: Map basic MBTI or temperament to UI theme choices
const DEFAULT_THEME: PersonalityTheme = {
    colorPalette: 'blue',
    typography: 'sans',
    animationStyle: 'smooth',
    llmTone: 'friendly',
};

const MBTI_THEMES: Record<string, PersonalityTheme> = {
    ENTP: {
        colorPalette: 'orange',
        typography: 'sans',
        animationStyle: 'bounce',
        llmTone: 'analytical',
    },
    INTJ: {
        colorPalette: 'purple',
        typography: 'serif',
        animationStyle: 'fade',
        llmTone: 'formal',
    },
};

export function getPersonalityTheme(profile: PersonalityProfile): PersonalityTheme {
    const mbti = profile.mbti && MBTI_THEMES[profile.mbti];
    return mbti || DEFAULT_THEME;
}

//# AETH: PersonalityThemeManager provides adaptive UI/UX based on user type
