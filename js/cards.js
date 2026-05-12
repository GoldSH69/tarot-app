/**
 * 타로 카드 데이터 (78장)
 * 메이저 아르카나 22장 + 마이너 아르카나 56장
 */

const TAROT_CARDS = {
  major: [
    {
      id: 'major-00',
      number: 0,
      name: '바보',
      nameEn: 'The Fool',
      category: 'major',
      image: 'images/cards/major/00-fool.webp',
      upright: {
        keywords: ['새로운 시작', '모험', '자유', '순수', '무한한 가능성'],
        meaning: '새로운 여정의 시작을 의미합니다. 두려움 없이 앞으로 나아가세요. 순수한 마음으로 세상을 바라보며, 미지의 세계로 발걸음을 내딛는 용기를 나타냅니다.'
      },
      reversed: {
        keywords: ['무모함', '부주의', '방향 상실', '어리석은 선택'],
        meaning: '충분한 준비 없이 무모하게 행동할 위험이 있습니다. 결정을 내리기 전에 한 번 더 생각해 보세요.'
      },
      symbols: '절벽 끝에 선 젊은이, 흰 장미(순수), 작은 가방(과거 경험), 흰 개(본능/충성)',
      element: '공기',
      planet: '천왕성'
    },
    {
      id: 'major-01',
      number: 1,
      name: '마법사',
      nameEn: 'The Magician',
      category: 'major',
      image: 'images/cards/major/01-magician.webp',
      upright: {
        keywords: ['의지력', '창조', '집중', '능력', '행동'],
        meaning: '당신에게는 원하는 것을 이룰 수 있는 모든 도구가 있습니다. 집중력과 의지로 현실을 창조하세요.'
      },
      reversed: {
        keywords: ['조작', '속임수', '재능 낭비', '우유부단'],
        meaning: '재능을 제대로 활용하지 못하고 있거나, 누군가의 속임수에 주의해야 합니다.'
      },
      symbols: '무한대 기호(∞), 4원소 도구(완드/컵/소드/펜타클), 장미와 백합',
      element: '공기',
      planet: '수성'
    },
    {
      id: 'major-02',
      number: 2,
      name: '여사제',
      nameEn: 'The High Priestess',
      category: 'major',
      image: 'images/cards/major/02-high-priestess.webp',
      upright: {
        keywords: ['직관', '무의식', '내면의 목소리', '신비', '지혜'],
        meaning: '직관을 믿으세요. 보이지 않는 것을 느끼는 능력이 필요한 때입니다. 내면의 목소리에 귀 기울이세요.'
      },
      reversed: {
        keywords: ['직관 무시', '비밀', '표면적 판단', '내면 억압'],
        meaning: '직관을 무시하고 있거나, 숨겨진 정보가 있을 수 있습니다.'
      },
      symbols: '달(직관), 석류(풍요), B와 J 기둥(이중성), 토라 두루마리(숨겨진 지식)',
      element: '물',
      planet: '달'
    },
    {
      id: 'major-03',
      number: 3,
      name: '여황제',
      nameEn: 'The Empress',
      category: 'major',
      image: 'images/cards/major/03-empress.webp',
      upright: {
        keywords: ['풍요', '모성', '자연', '아름다움', '창조력'],
        meaning: '풍요로움과 창조적 에너지가 넘치는 시기입니다. 자연과 연결하고, 아름다움을 즐기세요.'
      },
      reversed: {
        keywords: ['의존', '공허', '창조력 부족', '과잉보호'],
        meaning: '창조적 에너지가 막혀 있거나, 타인에게 지나치게 의존하고 있을 수 있습니다.'
      },
      symbols: '12개의 별 왕관, 석류 문양, 밀밭(풍요), 금성 기호',
      element: '흙',
      planet: '금성'
    },
    {
      id: 'major-04',
      number: 4,
      name: '황제',
      nameEn: 'The Emperor',
      category: 'major',
      image: 'images/cards/major/04-emperor.webp',
      upright: {
        keywords: ['권위', '구조', '안정', '리더십', '통제'],
        meaning: '체계와 질서를 세울 때입니다. 강한 리더십과 안정적인 기반을 만들어 나가세요.'
      },
      reversed: {
        keywords: ['독재', '유연성 부족', '과도한 통제', '권위 남용'],
        meaning: '지나친 통제나 경직된 태도가 문제를 일으킬 수 있습니다. 유연함이 필요합니다.'
      },
      symbols: '양 머리 장식(화성/리더십), 돌 왕좌(안정), 붉은 옷(열정/권위)',
      element: '불',
      planet: '화성'
    },
    {
      id: 'major-05',
      number: 5,
      name: '교황',
      nameEn: 'The Hierophant',
      category: 'major',
      image: 'images/cards/major/05-hierophant.webp',
      upright: {
        keywords: ['전통', '가르침', '신앙', '관습', '멘토'],
        meaning: '전통적인 가치와 가르침을 따를 때입니다. 경험 많은 멘토의 조언을 구하세요.'
      },
      reversed: {
        keywords: ['관습 탈피', '자유로운 사고', '반항', '비전통'],
        meaning: '기존의 규칙에서 벗어나 자신만의 길을 찾아야 할 때입니다.'
      },
      symbols: '삼중 십자가, 두 기둥, 교차된 열쇠(지식의 열쇠), 두 신도',
      element: '흙',
      planet: '금성'
    },
    {
      id: 'major-06',
      number: 6,
      name: '연인',
      nameEn: 'The Lovers',
      category: 'major',
      image: 'images/cards/major/06-lovers.webp',
      upright: {
        keywords: ['사랑', '조화', '선택', '가치관', '파트너십'],
        meaning: '중요한 선택의 순간입니다. 마음의 소리를 듣고 진정한 사랑과 가치에 따라 결정하세요.'
      },
      reversed: {
        keywords: ['불화', '잘못된 선택', '가치관 충돌', '유혹'],
        meaning: '관계에 불화가 있거나, 가치관에 맞지 않는 선택을 할 위험이 있습니다.'
      },
      symbols: '천사 라파엘(축복), 선악과 나무, 불꽃의 나무(열정), 벌거벗은 남녀(순수)',
      element: '공기',
      planet: '수성'
    },
    {
      id: 'major-07',
      number: 7,
      name: '전차',
      nameEn: 'The Chariot',
      category: 'major',
      image: 'images/cards/major/07-chariot.webp',
      upright: {
        keywords: ['승리', '의지', '결단', '전진', '자기 통제'],
        meaning: '강한 의지로 장애물을 극복하고 승리할 때입니다. 목표를 향해 흔들림 없이 전진하세요.'
      },
      reversed: {
        keywords: ['방향 상실', '공격성', '통제 불능', '좌절'],
        meaning: '방향을 잃었거나 상황이 통제 불능 상태입니다. 잠시 멈추고 방향을 재정립하세요.'
      },
      symbols: '별 왕관, 흑백 스핑크스(이중성), 갑옷(보호), 도시 배경(출발)',
      element: '물',
      planet: '달'
    },
    {
      id: 'major-08',
      number: 8,
      name: '힘',
      nameEn: 'Strength',
      category: 'major',
      image: 'images/cards/major/08-strength.webp',
      upright: {
        keywords: ['내면의 힘', '용기', '인내', '자비', '부드러운 통제'],
        meaning: '부드러움 속에 진정한 강함이 있습니다. 내면의 힘으로 어려움을 이겨내세요.'
      },
      reversed: {
        keywords: ['자기 의심', '나약함', '자신감 부족', '두려움'],
        meaning: '자신감이 부족하거나 내면의 힘을 잃고 있습니다. 자신을 믿으세요.'
      },
      symbols: '무한대 기호, 사자(본능), 흰 옷 여인(순수한 힘), 꽃 화관',
      element: '불',
      planet: '태양'
    },
    {
      id: 'major-09',
      number: 9,
      name: '은둔자',
      nameEn: 'The Hermit',
      category: 'major',
      image: 'images/cards/major/09-hermit.webp',
      upright: {
        keywords: ['성찰', '고독', '내면 탐색', '지혜', '안내'],
        meaning: '홀로 시간을 보내며 내면을 탐색할 때입니다. 진정한 답은 자신 안에 있습니다.'
      },
      reversed: {
        keywords: ['고립', '외로움', '은둔', '현실 회피'],
        meaning: '지나친 고립이 문제가 될 수 있습니다. 다시 세상과 연결이 필요합니다.'
      },
      symbols: '등불(진리의 빛), 지팡이(지혜), 산꼭대기(성취), 회색 망토(은둔)',
      element: '흙',
      planet: '수성'
    },
    {
      id: 'major-10',
      number: 10,
      name: '운명의 수레바퀴',
      nameEn: 'Wheel of Fortune',
      category: 'major',
      image: 'images/cards/major/10-wheel-of-fortune.webp',
      upright: {
        keywords: ['운명', '변화', '순환', '행운', '전환점'],
        meaning: '인생의 전환점에 서 있습니다. 운명의 바퀴가 돌아가며 새로운 기회가 찾아옵니다.'
      },
      reversed: {
        keywords: ['불운', '저항', '변화 거부', '정체'],
        meaning: '변화에 저항하고 있거나, 일시적인 불운의 시기입니다. 이 또한 지나갑니다.'
      },
      symbols: '바퀴(순환), 네 모서리의 생명체(4원소), 스핑크스(지혜), 히브리 문자',
      element: '불',
      planet: '목성'
    },
    {
      id: 'major-11',
      number: 11,
      name: '정의',
      nameEn: 'Justice',
      category: 'major',
      image: 'images/cards/major/11-justice.webp',
      upright: {
        keywords: ['공정', '진실', '균형', '법', '결과'],
        meaning: '공정한 결과가 찾아옵니다. 진실에 기반하여 행동하면 정의로운 결과를 얻습니다.'
      },
      reversed: {
        keywords: ['불공정', '부정직', '책임 회피', '편향'],
        meaning: '불공정한 상황이거나 책임을 회피하고 있습니다. 정직하게 마주하세요.'
      },
      symbols: '저울(균형), 검(결단), 왕관(권위), 붉은 망토(행동)',
      element: '공기',
      planet: '금성'
    },
    {
      id: 'major-12',
      number: 12,
      name: '매달린 사람',
      nameEn: 'The Hanged Man',
      category: 'major',
      image: 'images/cards/major/12-hanged-man.webp',
      upright: {
        keywords: ['항복', '새로운 관점', '희생', '기다림', '깨달음'],
        meaning: '관점을 바꿔보세요. 잠시 멈추고 다른 각도에서 상황을 바라보면 새로운 깨달음을 얻습니다.'
      },
      reversed: {
        keywords: ['지연', '저항', '무의미한 희생', '우유부단'],
        meaning: '불필요한 희생을 하고 있거나, 결정을 미루고 있습니다.'
      },
      symbols: 'T자 나무(생명나무), 후광(깨달음), 한쪽 발 묶임(자발적 제한)',
      element: '물',
      planet: '해왕성'
    },
    {
      id: 'major-13',
      number: 13,
      name: '죽음',
      nameEn: 'Death',
      category: 'major',
      image: 'images/cards/major/13-death.webp',
      upright: {
        keywords: ['끝과 시작', '변화', '변환', '해방', '재탄생'],
        meaning: '한 시대의 끝이 새로운 시작을 의미합니다. 낡은 것을 보내고 새로움을 맞이하세요.'
      },
      reversed: {
        keywords: ['변화 거부', '집착', '정체', '두려움'],
        meaning: '필요한 변화를 거부하고 있습니다. 놓아줘야 할 것을 놓아주세요.'
      },
      symbols: '해골 기사(불가피한 변화), 흰 장미 깃발(순수/새시작), 떠오르는 태양',
      element: '물',
      planet: '명왕성'
    },
    {
      id: 'major-14',
      number: 14,
      name: '절제',
      nameEn: 'Temperance',
      category: 'major',
      image: 'images/cards/major/14-temperance.webp',
      upright: {
        keywords: ['균형', '조화', '절제', '인내', '적응'],
        meaning: '균형과 조화를 이루세요. 극단을 피하고 중용의 길을 걸으면 좋은 결과를 얻습니다.'
      },
      reversed: {
        keywords: ['불균형', '과잉', '조급함', '부조화'],
        meaning: '균형을 잃고 있거나 너무 성급하게 행동하고 있습니다.'
      },
      symbols: '천사(수호/균형), 두 컵(조화), 한 발은 땅 한 발은 물(현실과 감성)',
      element: '불',
      planet: '목성'
    },
    {
      id: 'major-15',
      number: 15,
      name: '악마',
      nameEn: 'The Devil',
      category: 'major',
      image: 'images/cards/major/15-devil.webp',
      upright: {
        keywords: ['속박', '유혹', '중독', '물질주의', '그림자'],
        meaning: '무엇에 얽매여 있는지 인식하세요. 자발적 속박에서 벗어날 힘은 이미 당신에게 있습니다.'
      },
      reversed: {
        keywords: ['해방', '속박 탈출', '억눌린 그림자', '자각'],
        meaning: '속박에서 벗어나기 시작하고 있습니다. 진정한 자유를 향해 나아가세요.'
      },
      symbols: '역오각별(물질), 사슬(느슨한 속박), 박쥐 날개(어둠), 뿔 달린 형상',
      element: '흙',
      planet: '토성'
    },
    {
      id: 'major-16',
      number: 16,
      name: '탑',
      nameEn: 'The Tower',
      category: 'major',
      image: 'images/cards/major/16-tower.webp',
      upright: {
        keywords: ['급변', '파괴', '각성', '해방', '진실 드러남'],
        meaning: '갑작스러운 변화가 찾아옵니다. 고통스럽지만 거짓 위에 세운 것이 무너지며 진실이 드러납니다.'
      },
      reversed: {
        keywords: ['변화 회피', '내면 변화', '재난 모면', '서서히 붕괴'],
        meaning: '불가피한 변화를 계속 회피하고 있거나, 서서히 무너지고 있는 것이 있습니다.'
      },
      symbols: '번개(신의 계시), 왕관 날아감(거짓 권위 상실), 떨어지는 사람들(해방)',
      element: '불',
      planet: '화성'
    },
    {
      id: 'major-17',
      number: 17,
      name: '별',
      nameEn: 'The Star',
      category: 'major',
      image: 'images/cards/major/17-star.webp',
      upright: {
        keywords: ['희망', '영감', '평화', '치유', '축복'],
        meaning: '희망의 빛이 비치고 있습니다. 어둠 뒤에 찾아온 평화와 치유의 시기입니다.'
      },
      reversed: {
        keywords: ['절망', '불신', '희망 상실', '단절'],
        meaning: '희망을 잃고 있거나 우주와의 연결이 끊어진 느낌입니다. 작은 빛을 찾으세요.'
      },
      symbols: '큰 별과 7개의 작은 별(차크라), 물을 붓는 여인(치유), 나체(순수/진실)',
      element: '공기',
      planet: '천왕성'
    },
    {
      id: 'major-18',
      number: 18,
      name: '달',
      nameEn: 'The Moon',
      category: 'major',
      image: 'images/cards/major/18-moon.webp',
      upright: {
        keywords: ['환상', '불안', '무의식', '직관', '미지'],
        meaning: '모든 것이 명확하지 않은 시기입니다. 불안함 속에서도 직관을 믿고 나아가세요.'
      },
      reversed: {
        keywords: ['혼란 해소', '진실 밝혀짐', '불안 극복', '명확해짐'],
        meaning: '혼란이 걷히고 상황이 명확해지기 시작합니다.'
      },
      symbols: '달(무의식/환상), 개와 늑대(길들여진 것과 야생), 가재(심층 무의식), 두 탑',
      element: '물',
      planet: '해왕성'
    },
    {
      id: 'major-19',
      number: 19,
      name: '태양',
      nameEn: 'The Sun',
      category: 'major',
      image: 'images/cards/major/19-sun.webp',
      upright: {
        keywords: ['기쁨', '성공', '활력', '긍정', '밝은 미래'],
        meaning: '밝고 희망찬 시기입니다! 성공과 기쁨이 가득합니다. 자신감을 가지고 빛나세요.'
      },
      reversed: {
        keywords: ['일시적 좌절', '과도한 낙관', '지연', '자만'],
        meaning: '좋은 에너지가 있지만 약간의 지연이나 과도한 낙관에 주의하세요.'
      },
      symbols: '태양(성공/활력), 해바라기(행복), 아이(순수/기쁨), 흰 말(순수한 힘)',
      element: '불',
      planet: '태양'
    },
    {
      id: 'major-20',
      number: 20,
      name: '심판',
      nameEn: 'Judgement',
      category: 'major',
      image: 'images/cards/major/20-judgement.webp',
      upright: {
        keywords: ['부활', '각성', '소명', '평가', '새로운 단계'],
        meaning: '인생의 중대한 전환점입니다. 과거를 돌아보고, 진정한 소명을 향해 일어나세요.'
      },
      reversed: {
        keywords: ['자기 비난', '소명 무시', '후회', '판단 미룸'],
        meaning: '자신을 너무 가혹하게 판단하거나, 중요한 결정을 미루고 있습니다.'
      },
      symbols: '천사 가브리엘의 나팔(각성), 관에서 일어나는 사람들(부활), 십자가 깃발',
      element: '불',
      planet: '명왕성'
    },
    {
      id: 'major-21',
      number: 21,
      name: '세계',
      nameEn: 'The World',
      category: 'major',
      image: 'images/cards/major/21-world.webp',
      upright: {
        keywords: ['완성', '성취', '통합', '여행', '목표 달성'],
        meaning: '하나의 사이클이 완성됩니다. 목표를 달성하고 온전한 성취감을 느끼는 축복의 시기입니다.'
      },
      reversed: {
        keywords: ['미완성', '지연', '성취 직전', '마무리 부족'],
        meaning: '거의 다 왔지만 마지막 단계가 남아있습니다. 포기하지 말고 마무리하세요.'
      },
      symbols: '월계관(승리), 춤추는 여인(기쁨), 4생명체(4원소 통합), 두 개의 봉(균형)',
      element: '흙',
      planet: '토성'
    }
  ],

  // 마이너 아르카나 - 완드
  wands: generateMinorSuit('wands', '완드', 'Wands', '불', '열정, 창조, 의지, 행동'),
  // 마이너 아르카나 - 컵
  cups: generateMinorSuit('cups', '컵', 'Cups', '물', '감정, 사랑, 직관, 관계'),
  // 마이너 아르카나 - 소드
  swords: generateMinorSuit('swords', '소드', 'Swords', '공기', '사고, 지성, 갈등, 진실'),
  // 마이너 아르카나 - 펜타클
  pentacles: generateMinorSuit('pentacles', '펜타클', 'Pentacles', '흙', '물질, 재정, 건강, 현실')
};

function generateMinorSuit(suitId, suitKo, suitEn, element, theme) {
  const courtNames = {
    11: { ko: '페이지', en: 'Page' },
    12: { ko: '나이트', en: 'Knight' },
    13: { ko: '퀸', en: 'Queen' },
    14: { ko: '킹', en: 'King' }
  };

  const minorMeanings = getMinorMeanings(suitId);

  const cards = [];
  for (let i = 1; i <= 14; i++) {
    let name, nameEn, number;
    if (i <= 10) {
      name = `${suitKo} ${i}`;
      nameEn = `${i === 1 ? 'Ace' : i} of ${suitEn}`;
      number = i;
    } else {
      const court = courtNames[i];
      name = `${suitKo} ${court.ko}`;
      nameEn = `${court.en} of ${suitEn}`;
      number = i;
    }

    const meaning = minorMeanings[i] || {
      upright: { keywords: [theme], meaning: `${suitKo} ${i}의 정방향 의미입니다.` },
      reversed: { keywords: ['주의'], meaning: `${suitKo} ${i}의 역방향 의미입니다.` }
    };

    cards.push({
      id: `${suitId}-${String(i).padStart(2, '0')}`,
      number: i,
      name,
      nameEn,
      category: suitId,
      image: `images/cards/minor/${suitId}-${String(i).padStart(2, '0')}.webp`,
      upright: meaning.upright,
      reversed: meaning.reversed,
      symbols: meaning.symbols || `${suitKo} 수트의 ${element} 원소 에너지`,
      element,
      suit: suitKo
    });
  }
  return cards;
}

function getMinorMeanings(suit) {
  const meanings = {
    wands: {
      1: {
        upright: { keywords: ['새로운 시작', '영감', '잠재력', '창조'], meaning: '새로운 열정과 영감이 불타오르는 시작! 창조적 에너지가 솟아납니다.' },
        reversed: { keywords: ['지연', '동기 부족', '방향 잃음'], meaning: '새로운 시작에 대한 두려움이나 동기 부족이 있습니다.' },
        symbols: '구름에서 나온 손이 잡은 싹이 트는 완드'
      },
      2: {
        upright: { keywords: ['계획', '결정', '미래 설계', '선택'], meaning: '미래를 계획하고 방향을 결정할 때입니다. 세상이 당신의 손에 있습니다.' },
        reversed: { keywords: ['우유부단', '계획 부족', '두려움'], meaning: '결정을 내리지 못하거나 계획이 부족합니다.' },
        symbols: '세계를 들고 있는 인물, 두 개의 완드'
      },
      3: {
        upright: { keywords: ['확장', '성장', '기회', '비전'], meaning: '노력의 결과가 나타나기 시작합니다. 더 넓은 세상으로 확장하세요.' },
        reversed: { keywords: ['지연', '좌절', '준비 부족'], meaning: '기대한 결과가 지연되고 있습니다. 인내가 필요합니다.' },
        symbols: '배와 바다(모험), 세 개의 완드를 든 인물'
      },
      4: {
        upright: { keywords: ['축하', '안정', '화합', '기쁨'], meaning: '기쁜 축하의 시간입니다. 달성한 것을 즐기고 감사하세요.' },
        reversed: { keywords: ['불안정', '변화', '축하 부족'], meaning: '안정을 잃거나 성취를 제대로 인정받지 못하고 있습니다.' },
        symbols: '꽃 장식의 네 완드, 춤추는 사람들'
      },
      5: {
        upright: { keywords: ['갈등', '경쟁', '의견 충돌', '도전'], meaning: '경쟁과 갈등의 시기지만, 이를 통해 성장합니다.' },
        reversed: { keywords: ['갈등 회피', '내면 갈등', '타협'], meaning: '갈등을 피하거나 억누르고 있습니다.' },
        symbols: '다섯 명의 싸우는 사람들, 혼란'
      },
      6: {
        upright: { keywords: ['승리', '인정', '자신감', '리더십'], meaning: '승리와 성공! 노력이 인정받고 당당하게 앞으로 나아갑니다.' },
        reversed: { keywords: ['자만', '허영', '실패 후 좌절'], meaning: '자만심에 주의하세요. 겸손이 필요한 때입니다.' },
        symbols: '월계관을 쓴 승리자, 말을 탄 행렬'
      },
      7: {
        upright: { keywords: ['방어', '도전', '용기', '끈기'], meaning: '도전에 맞서 싸울 때입니다. 용기를 가지고 포기하지 마세요.' },
        reversed: { keywords: ['압도', '포기', '자신감 부족'], meaning: '도전에 압도당하고 있습니다. 전략을 다시 세우세요.' },
        symbols: '높은 곳에서 완드로 싸우는 인물'
      },
      8: {
        upright: { keywords: ['속도', '진행', '여행', '빠른 변화'], meaning: '일이 빠르게 진행됩니다. 흐름에 올라타세요!' },
        reversed: { keywords: ['지연', '정체', '성급함', '혼란'], meaning: '일이 지연되거나 너무 많은 일이 동시에 일어나 혼란스럽습니다.' },
        symbols: '하늘을 나는 8개의 완드, 속도감'
      },
      9: {
        upright: { keywords: ['인내', '경계', '결단', '마지막 시련'], meaning: '마지막 시련입니다. 지치더라도 포기하지 마세요. 곧 결실을 맺습니다.' },
        reversed: { keywords: ['의심', '편집증', '지침', '포기'], meaning: '지쳐서 포기하고 싶은 마음이 들지만, 조금만 더 버티세요.' },
        symbols: '상처 입은 채 완드에 기댄 인물, 경계하는 모습'
      },
      10: {
        upright: { keywords: ['책임', '부담', '짐', '완수 직전'], meaning: '무거운 짐을 지고 있지만 목적지가 가까워졌습니다. 도움을 구하세요.' },
        reversed: { keywords: ['과부하', '위임', '짐 내려놓기'], meaning: '너무 많은 짐을 혼자 짊어지고 있습니다. 내려놓을 것을 내려놓으세요.' },
        symbols: '10개의 완드를 힘겹게 지고 가는 인물'
      },
      11: {
        upright: { keywords: ['열정', '모험', '자유', '탐험', '새 소식'], meaning: '새로운 모험에 대한 열정이 넘칩니다. 호기심을 따라가세요.' },
        reversed: { keywords: ['방향 없는 열정', '충동', '좌절'], meaning: '열정은 있지만 방향이 없습니다. 목표를 명확히 하세요.' },
        symbols: '완드를 들고 서 있는 젊은이(사막 배경)'
      },
      12: {
        upright: { keywords: ['열정적 행동', '모험', '용기', '추진력'], meaning: '열정적으로 행동에 나설 때입니다! 두려움 없이 전진하세요.' },
        reversed: { keywords: ['성급함', '무모함', '분노', '좌절'], meaning: '너무 성급하거나 무모한 행동을 하고 있습니다. 잠시 멈추세요.' },
        symbols: '말을 타고 전진하는 기사, 불타는 완드'
      },
      13: {
        upright: { keywords: ['자신감', '독립', '따뜻함', '결단력'], meaning: '자신감 있고 따뜻한 에너지로 주변을 이끕니다.' },
        reversed: { keywords: ['질투', '이기심', '지배적', '요구적'], meaning: '지나친 통제나 질투에 주의하세요.' },
        symbols: '왕좌에 앉아 해바라기와 완드를 든 여왕'
      },
      14: {
        upright: { keywords: ['리더십', '비전', '대담함', '카리스마'], meaning: '강한 리더십과 비전으로 목표를 이끌어 갈 때입니다.' },
        reversed: { keywords: ['독재적', '충동적', '오만', '기대에 못 미침'], meaning: '지나친 리더십이 독재가 되지 않도록 주의하세요.' },
        symbols: '왕좌에 앉은 왕, 도마뱀(불), 완드와 사자'
      }
    },
    cups: {
      1: {
        upright: { keywords: ['새로운 감정', '사랑', '직관', '기쁨'], meaning: '새로운 감정적 시작! 사랑, 기쁨, 창의적 영감이 흘러넘칩니다.' },
        reversed: { keywords: ['감정 억압', '공허', '사랑 차단'], meaning: '감정을 억누르고 있거나 사랑을 받아들이지 못하고 있습니다.' },
        symbols: '성배에서 넘치는 물, 비둘기(평화), 연꽃'
      },
      2: {
        upright: { keywords: ['파트너십', '사랑', '조화', '연결'], meaning: '깊은 연결과 조화로운 관계를 맺는 시기입니다.' },
        reversed: { keywords: ['불화', '단절', '불균형 관계'], meaning: '관계에 불균형이나 소통 문제가 있습니다.' },
        symbols: '두 사람이 컵을 나누며 마주보는 장면'
      },
      3: {
        upright: { keywords: ['축하', '우정', '즐거움', '공동체'], meaning: '즐거운 축하와 우정의 시간! 함께하는 기쁨을 만끽하세요.' },
        reversed: { keywords: ['과음', '고립', '쾌락 탐닉'], meaning: '즐거움에 지나치게 빠지거나 관계에서 고립되고 있습니다.' },
        symbols: '세 사람의 축배, 풍요로운 식탁'
      },
      4: {
        upright: { keywords: ['권태', '무관심', '명상', '재평가'], meaning: '현재에 만족하지 못하고 있습니다. 진정으로 원하는 것을 생각해보세요.' },
        reversed: { keywords: ['새 인식', '기회 발견', '행동 시작'], meaning: '새로운 가능성을 발견하기 시작합니다.' },
        symbols: '나무 아래 앉은 인물, 3개의 컵과 구름 위의 1개 컵'
      },
      5: {
        upright: { keywords: ['상실', '슬픔', '후회', '비탄'], meaning: '상실과 슬픔의 시기입니다. 하지만 남아있는 것에 주목하세요.' },
        reversed: { keywords: ['회복', '수용', '전진', '용서'], meaning: '슬픔에서 회복하기 시작합니다. 앞으로 나아갈 때입니다.' },
        symbols: '쏟아진 3개의 컵, 서 있는 2개의 컵, 검은 망토'
      },
      6: {
        upright: { keywords: ['향수', '추억', '순수함', '과거'], meaning: '과거의 아름다운 추억과 순수했던 시절을 돌아봅니다.' },
        reversed: { keywords: ['과거 집착', '비현실적 기대', '전진 필요'], meaning: '과거에 집착하지 말고 현재를 살아가세요.' },
        symbols: '어린이와 꽃이 담긴 컵, 오래된 집'
      },
      7: {
        upright: { keywords: ['환상', '선택', '유혹', '상상'], meaning: '많은 선택지 앞에서 환상에 빠지지 마세요. 현실적으로 판단하세요.' },
        reversed: { keywords: ['현실 직시', '선택 완료', '명확한 결정'], meaning: '환상에서 벗어나 현실을 직시하게 됩니다.' },
        symbols: '구름 속 7개의 환상적 컵, 실루엣'
      },
      8: {
        upright: { keywords: ['떠남', '포기', '새 길', '변화 수용'], meaning: '더 이상 의미 없는 것을 떠나 새로운 길을 찾을 때입니다.' },
        reversed: { keywords: ['표류', '두려움', '변화 거부', '방황'], meaning: '떠나야 할지 말아야 할지 결정하지 못하고 있습니다.' },
        symbols: '뒤에 쌓인 컵을 두고 떠나는 인물, 달빛'
      },
      9: {
        upright: { keywords: ['만족', '소원 성취', '행복', '풍요'], meaning: '소원이 이루어지는 카드! 깊은 만족과 행복을 누리세요.' },
        reversed: { keywords: ['불만족', '탐욕', '과도한 욕심'], meaning: '이미 충분한 것을 가지고 있으면서도 만족하지 못하고 있습니다.' },
        symbols: '아홉 개의 컵이 늘어선 앞에 만족한 표정의 인물'
      },
      10: {
        upright: { keywords: ['행복', '가정', '조화', '완전한 사랑'], meaning: '완전한 감정적 성취! 행복한 가정, 사랑, 조화를 이루었습니다.' },
        reversed: { keywords: ['가정 불화', '이상과 현실 괴리', '깨진 꿈'], meaning: '관계나 가정에 균열이 생겼습니다. 소통이 필요합니다.' },
        symbols: '무지개 아래 10개의 컵, 행복한 가족'
      },
      11: {
        upright: { keywords: ['감성', '직관', '꿈', '창의적 메시지'], meaning: '감성적이고 직관적인 메시지가 찾아옵니다. 꿈에 주목하세요.' },
        reversed: { keywords: ['감정적 미성숙', '비현실적', '공상'], meaning: '감정에 치우치거나 비현실적인 기대를 하고 있습니다.' },
        symbols: '컵에서 물고기를 바라보는 젊은이'
      },
      12: {
        upright: { keywords: ['로맨스', '매력', '감정적 제안', '기사도'], meaning: '감정적인 제안이나 로맨틱한 기회가 찾아옵니다.' },
        reversed: { keywords: ['환상적 사랑', '변덕', '감정적 조종'], meaning: '감정에 휘둘리거나 비현실적인 사랑을 추구하고 있습니다.' },
        symbols: '백마를 타고 컵을 든 기사'
      },
      13: {
        upright: { keywords: ['공감', '자비', '직관', '돌봄'], meaning: '깊은 공감과 자비로 주변을 따뜻하게 감싸안습니다.' },
        reversed: { keywords: ['감정적 의존', '과잉 돌봄', '질투'], meaning: '감정적으로 지나치게 의존하거나 의존시키고 있습니다.' },
        symbols: '화려한 왕좌에 앉아 컵을 들고 있는 여왕, 물'
      },
      14: {
        upright: { keywords: ['감정적 균형', '지혜', '관대', '자비'], meaning: '감정적으로 성숙하고 균형 잡힌 리더십을 보여줍니다.' },
        reversed: { keywords: ['감정적 조종', '냉정', '감정 억제'], meaning: '감정을 억제하거나 감정적으로 조종하려 할 수 있습니다.' },
        symbols: '물 위 왕좌에 앉은 왕, 돌고래, 배'
      }
    },
    swords: {
      1: {
        upright: { keywords: ['진실', '명확함', '새 아이디어', '돌파구'], meaning: '명확한 진실과 새로운 아이디어가 떠오릅니다. 결단의 시간입니다.' },
        reversed: { keywords: ['혼란', '잘못된 판단', '속임수'], meaning: '진실이 가려져 있거나 잘못된 판단을 할 수 있습니다.' },
                symbols: '구름 속 손이 잡은 검, 왕관과 올리브 가지'
      },
      2: {
        upright: { keywords: ['결정 보류', '교착', '균형', '선택 어려움'], meaning: '두 가지 선택 사이에서 갈등하고 있습니다. 직관을 믿으세요.' },
        reversed: { keywords: ['정보 과다', '혼란', '거짓 평화'], meaning: '결정을 더 이상 미룰 수 없습니다. 진실을 마주하세요.' },
        symbols: '눈을 가린 채 두 검을 교차한 인물, 달'
      },
      3: {
        upright: { keywords: ['슬픔', '마음의 상처', '이별', '비탄'], meaning: '마음에 깊은 상처를 받는 시기입니다. 슬픔을 인정하고 치유하세요.' },
        reversed: { keywords: ['회복', '용서', '상처 극복', '전진'], meaning: '마음의 상처에서 회복되기 시작합니다.' },
        symbols: '심장을 관통하는 세 개의 검, 비구름'
      },
      4: {
        upright: { keywords: ['휴식', '회복', '명상', '충전'], meaning: '잠시 멈추고 휴식을 취하세요. 회복의 시간이 필요합니다.' },
        reversed: { keywords: ['불안', '번아웃', '강제 휴식', '회복 거부'], meaning: '쉬어야 하는데 쉬지 못하고 있습니다. 멈추세요.' },
        symbols: '누워있는 기사, 교회 스테인드글라스, 세 개의 검'
      },
      5: {
        upright: { keywords: ['패배', '갈등', '비열함', '승리의 대가'], meaning: '갈등에서 상처만 남은 승리입니다. 정말 이길 가치가 있는지 생각하세요.' },
        reversed: { keywords: ['화해', '후회', '갈등 해소 시도'], meaning: '갈등의 후유증에서 벗어나려 합니다. 화해를 시도하세요.' },
        symbols: '쓸쓸히 검을 줍는 인물, 떠나는 패배자들'
      },
      6: {
        upright: { keywords: ['이동', '변화', '치유', '전환'], meaning: '어려운 시기를 지나 더 나은 곳으로 이동합니다. 변화를 수용하세요.' },
        reversed: { keywords: ['정체', '미해결', '변화 거부'], meaning: '필요한 변화를 거부하거나 과거에 묶여 있습니다.' },
        symbols: '배를 타고 물을 건너는 인물들, 여섯 개의 검'
      },
      7: {
        upright: { keywords: ['전략', '기만', '은밀한 행동', '계략'], meaning: '전략적으로 행동해야 할 때입니다. 하지만 정직함을 잃지 마세요.' },
        reversed: { keywords: ['비밀 폭로', '양심', '전략 실패'], meaning: '숨겨진 것이 드러나거나 전략이 실패할 수 있습니다.' },
        symbols: '텐트에서 검을 훔쳐가는 인물'
      },
      8: {
        upright: { keywords: ['속박', '제한', '무력감', '자기 제한'], meaning: '스스로를 가둔 감옥에서 벗어나세요. 탈출구는 항상 있습니다.' },
        reversed: { keywords: ['해방', '자유', '제한 극복', '새 시각'], meaning: '속박에서 벗어나기 시작합니다. 자유가 가까워지고 있습니다.' },
        symbols: '눈가리고 묶인 인물, 8개의 검으로 둘러싸임'
      },
      9: {
        upright: { keywords: ['불안', '악몽', '걱정', '절망감'], meaning: '밤새 걱정에 시달리고 있습니다. 두려움은 실제보다 크게 느껴집니다.' },
        reversed: { keywords: ['걱정 해소', '희망', '회복', '깨어남'], meaning: '악몽에서 깨어나 현실을 직시합니다. 생각보다 나쁘지 않습니다.' },
        symbols: '침대에서 고뇌하는 인물, 벽의 9개 검'
      },
      10: {
        upright: { keywords: ['끝', '바닥', '배신', '완전한 패배'], meaning: '가장 어두운 순간이지만 이것은 끝이자 새로운 시작입니다. 동이 트고 있습니다.' },
        reversed: { keywords: ['회복 시작', '바닥 찍음', '재기', '생존'], meaning: '최악의 순간을 지나 회복이 시작됩니다.' },
        symbols: '쓰러진 인물의 등에 꽂힌 10개의 검, 먼동'
      },
      11: {
        upright: { keywords: ['호기심', '관찰', '경계', '새 정보'], meaning: '예리한 관찰력으로 주변을 살피세요. 중요한 정보가 있습니다.' },
        reversed: { keywords: ['험담', '스파이', '부주의', '성급한 판단'], meaning: '뒷담화나 험담에 주의하세요. 정보를 신중히 다루세요.' },
        symbols: '검을 들고 주변을 관찰하는 젊은이'
      },
      12: {
        upright: { keywords: ['행동', '결단', '빠른 사고', '용기'], meaning: '빠르고 결단력 있게 행동할 때입니다. 주저하지 마세요.' },
        reversed: { keywords: ['충동', '무모함', '공격성', '성급함'], meaning: '너무 급하게 행동하면 후회합니다. 잠시 생각하세요.' },
        symbols: '질주하는 말 위의 기사, 바람에 나부끼는 구름'
      },
      13: {
        upright: { keywords: ['독립', '명석함', '직관적 진실', '경험의 지혜'], meaning: '명석한 판단력과 독립적 사고로 진실을 꿰뚫어 봅니다.' },
        reversed: { keywords: ['냉정함', '고립', '잔인한 진실', '편협'], meaning: '지나치게 냉정하거나 편협한 시각에 주의하세요.' },
        symbols: '검과 나비가 새겨진 왕좌의 여왕'
      },
      14: {
        upright: { keywords: ['지적 권위', '분석력', '공정', '윤리'], meaning: '논리적이고 공정한 판단으로 상황을 이끌어야 합니다.' },
        reversed: { keywords: ['냉혹', '권력 남용', '비윤리적', '폭군'], meaning: '지성을 권력 남용에 사용하지 않도록 주의하세요.' },
        symbols: '높은 왕좌의 왕, 검과 천사, 나비, 달'
      }
    },
    pentacles: {
      1: {
        upright: { keywords: ['새로운 기회', '번영', '풍요', '현실화'], meaning: '물질적 새 시작! 새로운 재정적 기회나 사업의 시작입니다.' },
        reversed: { keywords: ['기회 놓침', '재정 불안', '계획 부족'], meaning: '좋은 기회를 놓치거나 재정적 계획이 부족합니다.' },
        symbols: '구름 속 손이 든 황금 펜타클, 정원'
      },
      2: {
        upright: { keywords: ['균형', '적응', '유연성', '멀티태스킹'], meaning: '여러 가지를 동시에 균형 있게 처리해야 합니다. 유연하게 대처하세요.' },
        reversed: { keywords: ['과부하', '불균형', '우선순위 혼란'], meaning: '너무 많은 일을 하며 균형을 잃고 있습니다.' },
        symbols: '두 펜타클을 저글링하는 인물, 무한대 리본'
      },
      3: {
        upright: { keywords: ['장인정신', '팀워크', '기술', '인정'], meaning: '당신의 기술과 노력이 인정받는 시기입니다. 전문성을 발휘하세요.' },
        reversed: { keywords: ['평범함', '인정 부족', '팀워크 부재'], meaning: '노력이 인정받지 못하거나 협업에 어려움이 있습니다.' },
        symbols: '성당에서 일하는 세 명의 석공'
      },
      4: {
        upright: { keywords: ['안정', '저축', '보수적', '보호'], meaning: '재정적 안정을 지키세요. 저축하고 소중한 것을 보호하세요.' },
        reversed: { keywords: ['인색', '집착', '물질 집착', '불안'], meaning: '물질에 지나치게 집착하거나 인색해지고 있습니다.' },
        symbols: '펜타클을 꼭 안고 있는 인물, 도시 배경'
      },
      5: {
        upright: { keywords: ['어려움', '빈곤', '고립', '건강 악화'], meaning: '물질적 어려움의 시기입니다. 도움을 구하는 것을 부끄러워하지 마세요.' },
        reversed: { keywords: ['회복', '도움 받음', '위기 극복'], meaning: '어려운 시기를 벗어나기 시작합니다. 도움의 손길이 있습니다.' },
        symbols: '눈 속 두 명의 빈곤한 인물, 교회 스테인드글라스'
      },
      6: {
        upright: { keywords: ['관대', '나눔', '베풂', '재정적 도움'], meaning: '나눔과 베풂의 시기입니다. 주는 것이 받는 것입니다.' },
        reversed: { keywords: ['이기심', '빚', '불공정한 거래'], meaning: '나눔에 조건이 따르거나 불공정한 상황이 있습니다.' },
        symbols: '가난한 이들에게 동전을 나누는 상인'
      },
      7: {
        upright: { keywords: ['인내', '투자', '장기 성장', '기다림'], meaning: '씨앗을 뿌리고 기다릴 때입니다. 장기적 투자의 결실이 옵니다.' },
        reversed: { keywords: ['조급함', '수확 부족', '낭비', '인내심 부족'], meaning: '결과가 바로 나오지 않아 조급해하고 있습니다.' },
        symbols: '펜타클 열매를 바라보며 기다리는 농부'
      },
      8: {
        upright: { keywords: ['장인정신', '노력', '기술 향상', '헌신'], meaning: '기술을 갈고닦는 시기입니다. 꾸준한 노력이 명작을 만듭니다.' },
        reversed: { keywords: ['완벽주의', '반복', '의미 상실', '지루함'], meaning: '기계적 반복에 빠지거나 일에서 의미를 잃고 있습니다.' },
        symbols: '펜타클을 조각하는 장인, 작업대'
      },
      9: {
        upright: { keywords: ['풍요', '자립', '사치', '성취'], meaning: '물질적 성공과 풍요를 이루었습니다! 노력의 결실을 즐기세요.' },
                reversed: { keywords: ['과시', '외로움', '물질 의존', '손실'], meaning: '물질적 풍요 속에서 정서적 공허를 느끼고 있습니다.' },
        symbols: '포도밭 속 화려한 옷의 인물, 매와 함께'
      },
      10: {
        upright: { keywords: ['유산', '가족', '부의 완성', '전통'], meaning: '물질적 완성과 가족의 풍요. 세대를 이어가는 유산을 만듭니다.' },
        reversed: { keywords: ['가족 분쟁', '재산 갈등', '불안정한 기반'], meaning: '가족 간 재산 문제나 기반의 불안정이 있습니다.' },
        symbols: '대가족, 저택, 풍요로운 정원, 10개의 펜타클'
      },
      11: {
        upright: { keywords: ['학습', '새 기술', '기회', '성실함'], meaning: '새로운 기술을 배우고 성장할 기회입니다. 성실하게 노력하세요.' },
        reversed: { keywords: ['게으름', '기회 놓침', '비현실적 목표'], meaning: '노력을 게을리하거나 기회를 놓치고 있습니다.' },
        symbols: '펜타클을 들고 공부하는 젊은이, 꽃밭'
      },
      12: {
        upright: { keywords: ['근면', '신뢰', '꾸준함', '실용적 진전'], meaning: '꾸준하고 실용적인 노력으로 목표에 다가갑니다.' },
        reversed: { keywords: ['정체', '게으름', '비효율', '방향 없는 노력'], meaning: '노력은 하지만 방향이 없거나 비효율적입니다.' },
        symbols: '말 위에서 펜타클을 들고 천천히 전진하는 기사'
      },
      13: {
        upright: { keywords: ['풍요', '안정', '실용적 지혜', '자급자족'], meaning: '풍요롭고 안정된 환경을 만듭니다. 실용적 지혜가 빛나는 시기입니다.' },
        reversed: { keywords: ['의존', '불안정', '가정 불화', '재정 불안'], meaning: '재정적 불안이나 가정의 불안정에 주의하세요.' },
        symbols: '정원 속 왕좌에 앉은 여왕, 토끼, 풍성한 자연'
      },
      14: {
        upright: { keywords: ['부', '사업 성공', '안정', '관대한 리더'], meaning: '물질적 성공의 정점! 풍요를 나누는 관대한 리더십을 보여주세요.' },
        reversed: { keywords: ['탐욕', '물질만능', '부패', '독점'], meaning: '탐욕이나 물질에 대한 과도한 집착에 주의하세요.' },
        symbols: '포도와 황소로 장식된 왕좌의 왕, 풍요로운 성'
      }
    }
  };

  return meanings[suit] || {};
}

// ============================================
// 전체 카드 목록을 평면 배열로 반환
// ============================================
function getAllCards() {
  return [
    ...TAROT_CARDS.major,
    ...TAROT_CARDS.wands,
    ...TAROT_CARDS.cups,
    ...TAROT_CARDS.swords,
    ...TAROT_CARDS.pentacles
  ];
}

// ============================================
// 카드 ID로 카드 찾기
// ============================================
function findCardById(id) {
  return getAllCards().find(c => c.id === id);
}

// ============================================
// 카테고리별 카드 가져오기
// ============================================
function getCardsByCategory(category) {
  if (category === 'major') return TAROT_CARDS.major;
  if (category === 'wands') return TAROT_CARDS.wands;
  if (category === 'cups') return TAROT_CARDS.cups;
  if (category === 'swords') return TAROT_CARDS.swords;
  if (category === 'pentacles') return TAROT_CARDS.pentacles;
  return getAllCards();
}

// ============================================
// 카드 이미지 없을 때 플레이스홀더 생성
// ============================================
function getCardImageUrl(card) {
  // 실제 이미지가 없으면 플레이스홀더 SVG 반환
  return card.image || createCardPlaceholder(card);
}

function createCardPlaceholder(card) {
  const colors = {
    major: '#6C5CE7',
    wands: '#e17055',
    cups: '#0984e3',
    swords: '#636e72',
    pentacles: '#00b894'
  };
  const color = colors[card.category] || '#6C5CE7';
  const number = card.number !== undefined ? card.number : '';
  const name = card.nameEn || card.name;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
    <rect width="200" height="300" rx="10" fill="${color}" opacity="0.15"/>
    <rect x="5" y="5" width="190" height="290" rx="8" fill="white" stroke="${color}" stroke-width="2"/>
    <text x="100" y="100" text-anchor="middle" font-size="48" fill="${color}" font-weight="bold">${number}</text>
    <text x="100" y="145" text-anchor="middle" font-size="12" fill="${color}">${card.name}</text>
    <text x="100" y="165" text-anchor="middle" font-size="9" fill="#999">${name}</text>
    <text x="100" y="220" text-anchor="middle" font-size="30">${getCategoryEmoji(card.category)}</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getCategoryEmoji(category) {
  const emojis = { major: '⭐', wands: '🔥', cups: '💧', swords: '💨', pentacles: '🌍' };
  return emojis[category] || '🃏';
}
