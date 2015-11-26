//
//  SiteMapItemChild.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 02/10/15.
//  Copyright (c) 2015 Backbase R&D B.V. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BackbaseCXP/CXPConstants.h>

/// SiteMapItemChild protocol. Conforming object represents a SiteMapItem with all internal structure.
@protocol SiteMapItemChild <NSObject>
@required

/// Returns the id of the item.
- (NSString*)itemRef;

/// Returns the name of the item.
- (NSString*)name;

/// Returns the path of the item.
- (NSString*)href;

/// Returns the type of the item. See CXPItemType for more details.
- (CXPItemType)itemType;

/// Returns an array of objects conforming the SiteMapItemChild, allows full traversal.
- (NSArray*)children;
@end
