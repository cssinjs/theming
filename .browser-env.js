import browserEnv from 'browser-env';
import { configure } from 'enzyme/build';
import Adapter from 'enzyme-adapter-react-16/build';

browserEnv(['window', 'document', 'navigator']);

configure({ adapter: new Adapter() });
