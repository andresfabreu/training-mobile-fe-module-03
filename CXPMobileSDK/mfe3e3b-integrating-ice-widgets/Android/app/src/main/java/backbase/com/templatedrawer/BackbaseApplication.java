package backbase.com.templatedrawer;

import android.app.Application;

import com.backbase.cxpandroid.Cxp;

public class BackbaseApplication extends Application {

    private static String configFilePath = "backbase/conf/configs.json";

    @Override
    public void onCreate() {
        super.onCreate();
        Cxp.setLogLevel(Cxp.LogLevel.DEBUG);
        Cxp.initialize(this, configFilePath);

        Cxp.setAppVersion(BuildConfig.VERSION_NAME);
    }

}
