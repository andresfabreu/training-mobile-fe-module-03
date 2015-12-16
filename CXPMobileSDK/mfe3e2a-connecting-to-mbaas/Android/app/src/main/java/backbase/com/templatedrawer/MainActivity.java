package backbase.com.templatedrawer;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.design.widget.NavigationView;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.backbase.cxpandroid.Cxp;
import com.backbase.cxpandroid.core.errorhandling.MissingConfigurationException;
import com.backbase.cxpandroid.core.utils.CxpLogger;
import com.backbase.cxpandroid.listeners.ModelListener;
import com.backbase.cxpandroid.listeners.NavigationEventListener;
import com.backbase.cxpandroid.listeners.SecurityViolationListener;
import com.backbase.cxpandroid.model.IconPack;
import com.backbase.cxpandroid.model.Model;
import com.backbase.cxpandroid.model.ModelSource;
import com.backbase.cxpandroid.model.Renderable;
import com.backbase.cxpandroid.navigation.NavigationEvent;

import java.util.ArrayList;
import java.util.List;

/**
 * Main Activity class for drawer based template
 * This example uses the new v22 design support library to implement navigation drawer pattern.
 */

public class MainActivity extends AppCompatActivity implements SecurityViolationListener{

    private final String logTag = MainActivity.class.getSimpleName();

    private DrawerLayout mDrawerLayout;
    private NavigationView mNavigationView;
    private Cxp cxpInstance;

    private List<String> mPageList = new ArrayList<>();
    private String currentItemId="";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //setup toolbar as action bar
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        // enable ActionBar icon to toggle nav drawer
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_menu);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        //register backstack listener to handle action bar icon changes
        getSupportFragmentManager().addOnBackStackChangedListener(mOnBackStackChangedListener);

        //setup the drawer navigation
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mNavigationView = (NavigationView) findViewById(R.id.navigation);
        mNavigationView.setNavigationItemSelectedListener(new DrawerItemClickListener());

        cxpInstance = Cxp.getInstance();
        cxpInstance.initializeXwalk(this);
        ContactFeature feature = new ContactFeature();
        feature.initialize(this, null);
        cxpInstance.registerFeature(feature);

        Cxp.getInstance().registerObserver("login-success", modelReload);

        if(Cxp.isDeviceRooted(this)){
            showSecurityViolationMessage(getString(R.string.device_rooted_title), getString(R.string.device_rooted_message));
        }else{
            loadModel();
        }
    }

    private void showSecurityViolationMessage(String title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setIcon(R.drawable.warning)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        loadModel();
                    }
                }).create().show();
    }

    void loadModel(){
        //load the model
        cxpInstance.getModel(new ModelListener<Model>() {

            @Override
            public void onModelReady(Model cxpModel) {

                CxpLogger.info(logTag, "model loaded");

                mPageList = cxpModel.getPageIdsFor("Main Navigation");
                //Menu menu = null;
                //create the main navigation drawer menu from the page list
                Menu menu = mNavigationView.getMenu();
                menu.clear();
                int id = 0;
                for (String pageId : mPageList) {
                    Renderable renderableItem = cxpModel.getAllPages().get(pageId);
                    MenuItem menuItem = menu.add(Menu.NONE, id++, Menu.NONE, renderableItem.getName());
                    IconPack iconPack = renderableItem.getIconByIndex(0);
                    if(iconPack!=null){
                        Drawable icon = iconPack.getNormal(getApplicationContext());
                        menuItem.setIcon(icon);
                    }

                }
                menu.setGroupCheckable(Menu.NONE, true, true);

                //show progress dialog
                final Dialog splash=new Dialog(MainActivity.this,android.R.style.Theme_Black_NoTitleBar_Fullscreen);
                splash.setContentView(R.layout.splash);
                splash.show();
                //register navigation and preload receivers
                cxpInstance.registerNavigationEventListener(new NavigationReceiver());
                cxpInstance.registerPreloadGlobalObserver(new BroadcastReceiver() {
                                                      @Override
                                                      public void onReceive(Context context, Intent intent) {
                                                          splash.dismiss();
                                                      }
                                                  }
                );
                replaceFragment(mPageList.get(0));
            }

            @Override
            public void onError(String error) {
                System.out.println("ERROR MESSAGE " + error);
            }
        }, ModelSource.SERVER);
    }

    BroadcastReceiver modelReload = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            loadModel();
        }
    };

    @Override
    protected void onDestroy() {
        getSupportFragmentManager().removeOnBackStackChangedListener(mOnBackStackChangedListener);
        super.onDestroy();
    }

    //backstack handler changing the action bar icon from drawer to back appearance
    private FragmentManager.OnBackStackChangedListener mOnBackStackChangedListener = new FragmentManager.OnBackStackChangedListener() {
        @Override
        public void onBackStackChanged() {
            int count = getSupportFragmentManager().getBackStackEntryCount();
            //if top level display hamburger icon, else standard back arraow
            if (count==0) {
                getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_menu);
            } else {
                getSupportActionBar().setHomeAsUpIndicator(null);
            }
            currentItemId="";
        }
    };

    @Override
    public void onSecurityViolation(String message) {
        showSecurityViolationMessage("Security Violation", message);
    }

    /* The click listener for NavigationView in the navigation drawer */
    private class DrawerItemClickListener implements NavigationView.OnNavigationItemSelectedListener {
        @Override
        public boolean onNavigationItemSelected(final MenuItem menuItem) {
            mDrawerLayout.closeDrawers();
            //delay the fragment replacement a little bit so that the drawer close animation runs more smoothly
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    replaceFragment(mPageList.get(menuItem.getItemId()));
                }
            }, 200);
            return true;
        }
    }

    /** Swaps fragments in the main content view and updates the drawer*/
    private void replaceFragment(String targetPageId) {

        if (currentItemId==targetPageId) {
            return;
        }
        currentItemId=targetPageId;
        // Create a new fragment and specify the page to show
        PageFragment pageFragment = PageFragment.newInstance(targetPageId);

        // Insert the fragment by replacing any existing fragment
        FragmentManager fragmentManager = getSupportFragmentManager();

        boolean isRootPage = mPageList.contains(targetPageId);
        if (isRootPage) {
            //mark item in the menu and clear backstack
            mNavigationView.getMenu().getItem(mPageList.indexOf(targetPageId)).setChecked(true);
            if (fragmentManager.getBackStackEntryCount()!=0) {
                fragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
            }
            fragmentManager.beginTransaction().
                    setCustomAnimations(R.anim.fade_in, R.anim.fade_out).
                    replace(R.id.content_frame, pageFragment).
                    commitAllowingStateLoss();
        } else {
            //child fragments are added to a back stack for proper back navigation
            fragmentManager.beginTransaction().
                    setCustomAnimations(R.anim.slide_in_left, R.anim.slide_in_left, R.anim.slide_out_right, R.anim.slide_out_right).
                    replace(R.id.content_frame, pageFragment).
                    addToBackStack(null).
                    commitAllowingStateLoss();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        // handle action buttons
        switch (item.getItemId()) {
            case android.R.id.home:
                // The action bar back/up action should either go to the last fragment or open the drawer when at top level
                if (!getSupportFragmentManager().popBackStackImmediate())
                    mDrawerLayout.openDrawer(GravityCompat.START);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    //display the name of the current portal
    private void showModelName() {

        String portalName = "NO_PORTAL";
        try {
            portalName = cxpInstance.getConfiguration().getPortal();
        } catch (MissingConfigurationException e) {
            e.printStackTrace();
        }

        new AlertDialog.Builder(this)
                .setTitle("Portal Name")
                .setMessage(portalName)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {
                    }
                }).show();

    }

    //listener for navigation events from the SDK
    private class NavigationReceiver implements NavigationEventListener {

        @Override
        public void onNavigationEvent(NavigationEvent navigationEvent) {
            String targetResource = navigationEvent.getTargetPageUri();
            Log.i(logTag,"navigation event "+navigationEvent.getRelationship()+":"+targetResource);
            switch(navigationEvent.getRelationship()) {
                case EXTERNAL:
                    //open external links in browser
                    if (!targetResource.startsWith("http://") && !targetResource.startsWith("https://"))
                        targetResource = "http://" + targetResource;
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(targetResource));
                    startActivity(i);
                    break;
                case ROOT:
                case CHILD:
                    //replace current fragment with new ROOT/CHILD
                    replaceFragment(targetResource);
                    break;
                //TODO implement the other cases
                default:
                    break;
            }


        }

    }


}
