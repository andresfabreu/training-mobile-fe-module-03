//
//  CXPConfiguration.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 08/02/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <BackbaseCXP/BackbaseCXP.h>

/// CXP specific configuration
@interface CXPConfiguration : NSObject

/// Portal related configurations
@property (strong, nonatomic) CXPPortalConfiguration* portal; //

/// Development related configurations
@property (strong, nonatomic) CXPDevelopmentConfiguration* development;

/// Template related configurations
#ifdef __cplusplus
@property (strong, nonatomic, getter=getTemplate, setter=setTemplate:) CXPTemplateConfiguration* _template;
#else
@property (strong, nonatomic, getter=getTemplate, setter=setTemplate:) CXPTemplateConfiguration* template;
#endif

/// Security related configurations
@property (strong, nonatomic) CXPSecurityConfiguration* security;

@end
