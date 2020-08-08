import ALIEN from 'src/assets/icons8-day-of-the-tentacle-100.png';
import ARTIFACT from 'src/assets/icons8-lightsaber-100.png';
import COIN from 'src/assets/icons8-dollar-coin-100.png';
import GOBLET from 'src/assets/icons8-trophy-cup-100.png';
import LINK from 'src/assets/icons8-link-100-2.png';
import LOCATION from 'src/assets/icons8-place-marker-100-2.png';
import PRIZE from 'src/assets/icons8-medal-first-place-100.png';
import RELATIONSHIP from 'src/assets/icons8-restart-love-100.png';
import TOOL from 'src/assets/icons8-hammer-100.png';
import TREASURE from 'src/assets/icons8-gold-bars-100.png';
import USER from 'src/assets/icons8-male-user-100.png';
import VESSEL from 'src/assets/icons8-box-100.png';
import WEAPON from 'src/assets/icons8-katana-sword-100.png';
import LEAVE from 'src/assets/icons8-export-100.png';

export type Icon =
  | 'ALIEN'
  | 'ARTIFACT'
  | 'CASTLE'
  | 'CHARACTER'
  | 'CHEST'
  | 'COIN'
  | 'CONTRAPTION'
  | 'DEMON'
  | 'DEVICE'
  | 'GOBLET'
  | 'HERO'
  | 'HOUSE'
  | 'HUT'
  | 'ITEM'
  | 'LINK'
  | 'LEAVE'
  | 'LOCATION'
  | 'MAP'
  | 'MONSTER'
  | 'OBSTACLE'
  | 'PRIZE'
  | 'RELATIONSHIP'
  | 'TOOL'
  | 'TOWER'
  | 'TREASURE'
  | 'USER'
  | 'VESSEL'
  | 'WEAPON';

export const Icons: Record<Icon, string> = {
  ALIEN,
  ARTIFACT,
  CASTLE: 'src/assets/',
  CHARACTER: 'src/assets/',
  CHEST: 'src/assets/',
  COIN,
  CONTRAPTION: 'src/assets/',
  DEMON: 'src/assets/',
  DEVICE: 'src/assets/',
  GOBLET,
  HERO: 'src/assets/',
  HOUSE: 'src/assets/',
  HUT: 'src/assets/',
  ITEM: 'src/assets/',
  LEAVE,
  LINK,
  LOCATION,
  MAP: 'src/assets/',
  MONSTER: 'src/assets/',
  OBSTACLE: 'src/assets/',
  PRIZE,
  RELATIONSHIP,
  TOOL,
  TOWER: 'src/assets/',
  TREASURE,
  USER,
  VESSEL,
  WEAPON,
};