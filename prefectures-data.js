/**
 * Prefecture Data for Japan
 * Contains all 47 prefectures with ISO codes (JP-01 to JP-47)
 */

const PREFECTURES = {
    'JP-01': { name: 'Hokkaido', nameJa: '北海道' },
    'JP-02': { name: 'Aomori', nameJa: '青森県' },
    'JP-03': { name: 'Iwate', nameJa: '岩手県' },
    'JP-04': { name: 'Miyagi', nameJa: '宮城県' },
    'JP-05': { name: 'Akita', nameJa: '秋田県' },
    'JP-06': { name: 'Yamagata', nameJa: '山形県' },
    'JP-07': { name: 'Fukushima', nameJa: '福島県' },
    'JP-08': { name: 'Ibaraki', nameJa: '茨城県' },
    'JP-09': { name: 'Tochigi', nameJa: '栃木県' },
    'JP-10': { name: 'Gunma', nameJa: '群馬県' },
    'JP-11': { name: 'Saitama', nameJa: '埼玉県' },
    'JP-12': { name: 'Chiba', nameJa: '千葉県' },
    'JP-13': { name: 'Tokyo', nameJa: '東京都' },
    'JP-14': { name: 'Kanagawa', nameJa: '神奈川県' },
    'JP-15': { name: 'Niigata', nameJa: '新潟県' },
    'JP-16': { name: 'Toyama', nameJa: '富山県' },
    'JP-17': { name: 'Ishikawa', nameJa: '石川県' },
    'JP-18': { name: 'Fukui', nameJa: '福井県' },
    'JP-19': { name: 'Yamanashi', nameJa: '山梨県' },
    'JP-20': { name: 'Nagano', nameJa: '長野県' },
    'JP-21': { name: 'Gifu', nameJa: '岐阜県' },
    'JP-22': { name: 'Shizuoka', nameJa: '静岡県' },
    'JP-23': { name: 'Aichi', nameJa: '愛知県' },
    'JP-24': { name: 'Mie', nameJa: '三重県' },
    'JP-25': { name: 'Shiga', nameJa: '滋賀県' },
    'JP-26': { name: 'Kyoto', nameJa: '京都府' },
    'JP-27': { name: 'Osaka', nameJa: '大阪府' },
    'JP-28': { name: 'Hyogo', nameJa: '兵庫県' },
    'JP-29': { name: 'Nara', nameJa: '奈良県' },
    'JP-30': { name: 'Wakayama', nameJa: '和歌山県' },
    'JP-31': { name: 'Tottori', nameJa: '鳥取県' },
    'JP-32': { name: 'Shimane', nameJa: '島根県' },
    'JP-33': { name: 'Okayama', nameJa: '岡山県' },
    'JP-34': { name: 'Hiroshima', nameJa: '広島県' },
    'JP-35': { name: 'Yamaguchi', nameJa: '山口県' },
    'JP-36': { name: 'Tokushima', nameJa: '徳島県' },
    'JP-37': { name: 'Kagawa', nameJa: '香川県' },
    'JP-38': { name: 'Ehime', nameJa: '愛媛県' },
    'JP-39': { name: 'Kochi', nameJa: '高知県' },
    'JP-40': { name: 'Fukuoka', nameJa: '福岡県' },
    'JP-41': { name: 'Saga', nameJa: '佐賀県' },
    'JP-42': { name: 'Nagasaki', nameJa: '長崎県' },
    'JP-43': { name: 'Kumamoto', nameJa: '熊本県' },
    'JP-44': { name: 'Oita', nameJa: '大分県' },
    'JP-45': { name: 'Miyazaki', nameJa: '宮崎県' },
    'JP-46': { name: 'Kagoshima', nameJa: '鹿児島県' },
    'JP-47': { name: 'Okinawa', nameJa: '沖縄県' }
};

// State constants
const STATE = {
    NOT_MARKED: 'not-marked',
    TO_VISIT: 'to-visit',
    VISITED: 'visited'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PREFECTURES, STATE };
}
