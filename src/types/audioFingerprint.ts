// audioFingerprint.ts

export class AudioFingerprinter {
    private audioContext: AudioContext;
    private analyser: AnalyserNode;

    constructor() {
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
    }

    async generateFingerprint(file: File): Promise<string> {
        try {
            const audioBuffer = await this.loadAudioFile(file);
            const fingerprint = await this.processAudioData(audioBuffer);
            return fingerprint;
        } catch (error) {
            console.error('Error generating fingerprint:', error);
            throw error;
        }
    }

    private async loadAudioFile(file: File): Promise<AudioBuffer> {
        const arrayBuffer = await file.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    private async processAudioData(audioBuffer: AudioBuffer): Promise<string> {
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        // Create multiple sample points throughout the audio
        const samplePoints = 10;
        const sampleLength = Math.floor(audioBuffer.length / samplePoints);
        let fingerprintData = [];

        for (let i = 0; i < samplePoints; i++) {
            const startIndex = i * sampleLength;
            const endIndex = startIndex + sampleLength;

            // Get frequency data for this segment
            const channelData = audioBuffer.getChannelData(0).slice(startIndex, endIndex);
            const segment = this.getRMSAmplitude(channelData);
            fingerprintData.push(segment);
        }

        // Create a hash from the fingerprint data
        const fingerprint = await this.hashData(fingerprintData);
        return fingerprint;
    }

    private getRMSAmplitude(channelData: Float32Array): number {
        const sum = channelData.reduce((acc, val) => acc + val * val, 0);
        return Math.sqrt(sum / channelData.length);
    }

    private async hashData(data: number[]): Promise<string> {
        const jsonString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const data8 = encoder.encode(jsonString);

        const hashBuffer = await crypto.subtle.digest('SHA-256', data8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    public dispose() {
        this.audioContext.close();
    }
}