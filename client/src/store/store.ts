import { CharacterType } from './predefinedEntityTypes';
import { atom } from 'recoil';
import { ObjectEntity } from '../models/Entity';

// TODO: remove
const mockDefaults = [
  {
    id: 'mock_0',
    name: 'Mike Mock',
    description:
      'A nice guy Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: CharacterType,
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_1',
    name: 'Maurice Longlastname',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Joker', 'Space Cowboy'],
  },
  {
    id: 'mock_2',
    name: 'Sven Manny Manny Names',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      color: '#ccddff',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_3',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_3',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_4',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_5',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_6',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
  {
    id: 'mock_7',
    name: 'Mike Mock',
    description:
      'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  },
] as ObjectEntity[];

export const CHARACTERS_STATE_ID = 'CHARACTERS_STATE_ID';

export const charactersState = atom<ObjectEntity[]>({
  key: 'CHARACTERS_STATE_ID',
  default: mockDefaults, //[],
});
