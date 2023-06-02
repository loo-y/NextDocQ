export const recordingIdleGap = 3000 // 3s irecording recording to idle gap

export const sortUniqKey = 'timestamp'

export enum navigationEnum {
    whisperAnswer = 'Whisper Interview',
    candidateHunting = 'Candidate Hunting',
    about = 'About',
}

export const navigation = [
    { name: 'Whisper Interview', href: '/whisperAnswer', type: navigationEnum.whisperAnswer },
    { name: 'Candidate Hunting', href: '/candidateHunting', type: navigationEnum.candidateHunting },
    { name: 'About', href: '/about', type: navigationEnum.about },
]
