import React, { useMemo, useRef, useState } from 'react';
import { SearchService } from '../../services/search';

type SpeechRecognitionLike = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: any) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

const getSpeechRecognition = (): (new () => SpeechRecognitionLike) | null => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

const speakAnswer = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
};

export const VoiceDatabaseSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

    const SpeechRecognition = useMemo(() => getSpeechRecognition(), []);
    const voiceSupported = !!SpeechRecognition;

    const ask = async (nextQuery = query) => {
        const trimmed = nextQuery.trim();
        if (!trimmed || isSearching) return;

        setIsSearching(true);
        setError('');
        setAnswer('');

        try {
            const result = await SearchService.askDatabase(trimmed);
            setAnswer(result.answer);
            speakAnswer(result.answer);
        } catch (e: any) {
            setError(e.message || 'Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const startListening = () => {
        if (!SpeechRecognition || isListening) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                transcript += event.results[i][0].transcript;
            }

            const nextQuery = transcript.trim();
            setQuery(nextQuery);

            const latest = event.results[event.results.length - 1];
            if (latest?.isFinal) {
                ask(nextQuery);
            }
        };

        recognition.onerror = () => {
            setError('Voice input was interrupted. Type the question instead.');
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    return (
        <section className="voice-search-panel" aria-label="Ask the database">
            <div className="voice-search-header">
                <div>
                    <h2>Ask The Database</h2>
                    <p>Use your voice or type a question about contestants, episodes, match rates, locations, and trends.</p>
                </div>
                <button
                    className={`voice-btn${isListening ? ' voice-btn--active' : ''}`}
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!voiceSupported || isSearching}
                    title={voiceSupported ? 'Start voice search' : 'Voice search is not supported by this browser'}
                    aria-pressed={isListening}
                >
                    {isListening ? 'Stop' : 'Voice'}
                </button>
            </div>

            <form
                className="voice-search-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    ask();
                }}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Example: Which episodes had the highest match rate?"
                    aria-label="Database question"
                />
                <button type="submit" className="analyze-btn" disabled={!query.trim() || isSearching}>
                    {isSearching ? 'Searching...' : 'Ask'}
                </button>
            </form>

            {!voiceSupported && (
                <p className="voice-search-note">Voice input is unavailable in this browser, but typed search still works.</p>
            )}

            {error && <div className="voice-search-error" role="alert">{error}</div>}
            {answer && <div className="voice-search-answer">{answer}</div>}
        </section>
    );
};
