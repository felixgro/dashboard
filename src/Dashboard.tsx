import MainForm from './components/MainForm';
import settings from './config/settings.json';
import './styles/App.css';

// import aliases
import hw from '@commands';
hw();

function Dashboard() {
  return (
    <>
      <MainForm
        defaultEngine="google"
        searchEngines={settings.searchEngines}
        commands={{}}
      />
    </>
  );
}

export default Dashboard;
