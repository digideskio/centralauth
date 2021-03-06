<?php
/**
 * Cut-down copy of User interface for local-interwiki-database
 * user rights manipulation.
 */
class CentralAuthGroupMembershipProxy {
	/**
	 * @var CentralAuthUser
	 */
	private $mGlobalUser;

	/**
	 * @param $user CentralAuthUser
	 */
	private function __construct( $user ) {
		$this->name = $user->getName();
		$this->mGlobalUser = $user;
	}

	/**
	 * @param $wikiID
	 * @param $id
	 * @return bool
	 */
	public static function whoIs( $wikiID, $id ) {
		$user = self::newFromId( $id );
		if ( $user ) {
			return $user->name;
		} else {
			return false;
		}
	}

	/**
	 * @param $name
	 * @return CentralAuthGroupMembershipProxy|null
	 */
	public static function newFromName( $name ) {
		$name = User::getCanonicalName( $name );
		$globalUser = CentralAuthUser::getInstanceByName( $name );
		return $globalUser->exists() ? new CentralAuthGroupMembershipProxy( $globalUser ) : null;
	}

	/**
	 * @param $id
	 * @return CentralAuthGroupMembershipProxy|null
	 */
	public static function newFromId( $id ) {
		$globalUser = CentralAuthUser::newFromId( $id );
		return $globalUser ? new CentralAuthGroupMembershipProxy( $globalUser ) : null;
	}

	/**
	 * @return Int
	 */
	public function getId() {
		return $this->mGlobalUser->getId();
	}

	/**
	 * @return bool
	 */
	public function isAnon() {
		return $this->getId() == 0;
	}

	/**
	 * @return String
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @return Title
	 */
	public function getUserPage() {
		return Title::makeTitle( NS_USER, $this->getName() );
	}

	/**
	 * Replaces getUserGroups()
	 * @return mixed
	 */
	function getGroups() {
		return $this->mGlobalUser->getGlobalGroups();
	}

	/**
	 * replaces addUserGroup
	 * @param $group
	 *
	 * @return bool
	 */
	function addGroup( $group ) {
		$this->mGlobalUser->addToGlobalGroups( $group );
		return true;
	}

	/**
	 * replaces removeUserGroup
	 * @param $group
	 *
	 * @return bool
	 */
	function removeGroup( $group ) {
		$this->mGlobalUser->removeFromGlobalGroups( $group );
		return true;
	}

	/**
	 * replaces touchUser
	 */
	function invalidateCache() {
		$this->mGlobalUser->invalidateCache();
	}

	/**
	 * @param $wiki string
	 * @return Bool
	 */
	function attachedOn( $wiki ) {
		return $this->mGlobalUser->attachedOn( $wiki );
	}
}
