import { readdirSync } from 'fs'
import * as path from 'path'
import BaseCommand from '../interfaces/BaseCommand'

const commands = readdirSync(path.resolve(__dirname, '../../commands'))
    .filter(f => f.endsWith('.js'))
    .map(f => require(path.resolve(__dirname, '../../commands', f)).default as BaseCommand)
    .sort()

export default commands
