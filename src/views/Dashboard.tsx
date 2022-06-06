import { Toaster } from 'react-hot-toast';
import MainForm from '../components/MainInput';
import settings from '../config/settings.json';
import '../styles/App.css';

import Hello from '../commands/Hello';

function Dashboard() {
  return (
    <>
      <MainForm
        defaultEngine="google"
        searchEngines={settings.searchEngines}
        commands={[Hello]}
      />
      <Toaster
        position='bottom-center'
      />
    </>
  );
}

export default Dashboard;
