import { CommonLayout } from 'shared/ui/layout';
import { withProviders } from './providers';

import 'app/index.css';
import { Routing } from 'pages';

function App() {
    return (
        <CommonLayout>
            <Routing />
        </CommonLayout>
    );
}

export default withProviders(App);
