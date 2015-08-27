//
//  CXPConstants.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 20/05/15.
//

#ifndef PUBLIC_CONSTANTS
#define PUBLIC_CONSTANTS

#define CXP_VERSION @"0.11.1"

#pragma mark - Logging

/// Defines logLevels for logging the SDK activity.
typedef NS_ENUM(NSUInteger, CXPLogLevel) {
    /// Suppress all internal logs
    CXPLogLevelNone = 0,
    /// Only display internal error messages
    CXPLogLevelError,
    /// Only display internal error and warnings messages
    CXPLogLevelWarn,
    /// Only display internal information, warning and errors messages
    CXPLogLevelInfo,
    /// Only display internal debug, information, warning and errors messages
    CXPLogLevelDebug,
};

#pragma mark - CXPConfiguration

/// CXPConfiguration.template[styles] key
static NSString* kCXPConfigurationTemplateStyles = @"styles";

/// CXPConfiguration.template[scripts] key
static NSString* kCXPConfigurationTemplateScripts = @"scripts";

/// CXPConfiguration.template[launchpad-dependencies] key
static NSString* kCXPConfigurationTemplateLaunchpadDependencies = @"launchpad-dependencies";

/// CXPConfiguration.template[extra-libraries] key
static NSString* kCXPConfigurationTemplateExtraLibraries = @"extra-libraries";

#pragma mark - Renderable

/// Possible types of item that can be rendered.
typedef enum { CXPItemTypeLink, CXPItemTypePage, CXPItemTypeWidget, CXPItemTypeLayout, CXPItemTypePortal } CXPItemType;

#pragma mark - Model

/// Preload preference key
static NSString* const kModelPreferencePreload = @"preload";

/// Retain preference key
static NSString* const kModelPreferenceRetain = @"retain";

#pragma mark - CXPNavigationFlowInformer

/// Navigation flow informer self relationship
static NSString* const kCXPNavigationFlowRelationshipSelf = @"SELF";
/// Navigation flow informer child relationship
static NSString* const kCXPNavigationFlowRelationshipChild = @"CHILD";
/// Navigation flow informer parent relationship
static NSString* const kCXPNavigationFlowRelationshipParent = @"PARENT";
/// Navigation flow informer root ancestor relationship
static NSString* const kCXPNavigationFlowRelationshipRootAncestor = @"ROOT_ANCESTOR";
/// Navigation flow informer root relationship
static NSString* const kCXPNavigationFlowRelationshipRoot = @"ROOT";
/// Navigation flow informer sibling relationship
static NSString* const kCXPNavigationFlowRelationshipSibling = @"SIBLING";
/// Navigation flow informer other relationship
static NSString* const kCXPNavigationFlowRelationshipOther = @"OTHER";
/// Navigation flow informer external relationship
static NSString* const kCXPNavigationFlowRelationshipExternal = @"EXTERNAL";
/// Navigation flow informer none relationship
static NSString* const kCXPNavigationFlowRelationshipNone = @"NONE";

#endif
