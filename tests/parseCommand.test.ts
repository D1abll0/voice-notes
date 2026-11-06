import { describe, test, expect } from 'vitest'
import { parseCommand } from '../src/features/voice/commands'

describe('parseCommand', () =>
{
	test('test parseCommand()', () =>
	{
		expect(parseCommand('add a new note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('add new note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('add a note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('add note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});

		expect(parseCommand('add a new note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('add new note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('add a note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('add note')).toEqual({kind: 'add', text: ''});
		
		expect(parseCommand('add eggs')).toEqual(null);

		expect(parseCommand('create a new note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('create new note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('create a note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		expect(parseCommand('create note buy some eggs')).toEqual({kind: 'add', text: 'buy some eggs'});
		
		expect(parseCommand('create a new note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('create new note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('create a note')).toEqual({kind: 'add', text: ''});
		expect(parseCommand('create note')).toEqual({kind: 'add', text: ''});

		expect(parseCommand('create eggs')).toEqual(null);

		expect(parseCommand('find note eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('find a note eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('find notes eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('find a notes eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('FIND MY NOTES eggs')).toEqual({kind: 'search', text: 'eggs'});

		expect(parseCommand('FIND eggs')).toEqual(null);
		expect(parseCommand('find node eggs')).toEqual(null);

		expect(parseCommand('search for my note eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('search for my notes eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('search my note eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('search my notes eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('search for note eggs')).toEqual({kind: 'search', text: 'eggs'});
		expect(parseCommand('search for notes eggs')).toEqual({kind: 'search', text: 'eggs'});

		expect(parseCommand('search eggs')).toEqual(null);
	})
})
