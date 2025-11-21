import PropTypes from 'prop-types';

/**
 * Workspace (Organization) schema
 */
export const WorkspaceSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  desc: PropTypes.string,
  url: PropTypes.string,
  website: PropTypes.string,
  logoHash: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.number),
  powerUps: PropTypes.arrayOf(PropTypes.any),
});

/**
 * Board schema
 */ 
export const BoardSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
  closed: PropTypes.bool,
  idWorkSpace: PropTypes.string,
  pinned: PropTypes.bool,
  url: PropTypes.string,
  shortUrl: PropTypes.string,
  prefs: PropTypes.object,
  labelNames: PropTypes.object,
  starred: PropTypes.bool,
  dateLastActivity: PropTypes.string,
  dateLastView: PropTypes.string,
});

/**
 * List schema
 */
export const ListSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  closed: PropTypes.bool,
  idBoard: PropTypes.string.isRequired,
  pos: PropTypes.number,
  subscribed: PropTypes.bool,
  softLimit: PropTypes.number,
});

/**
 * Card schema
 */
export const CardSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
  closed: PropTypes.bool,
  idList: PropTypes.string.isRequired,
  idBoard: PropTypes.string.isRequired,
  idMembers: PropTypes.arrayOf(PropTypes.string),
  idLabels: PropTypes.arrayOf(PropTypes.string),
  url: PropTypes.string,
  shortUrl: PropTypes.string,
  pos: PropTypes.number,
  due: PropTypes.string,
  dueComplete: PropTypes.bool,
  dateLastActivity: PropTypes.string,
  badges: PropTypes.object,
  labels: PropTypes.arrayOf(PropTypes.object),
  cover: PropTypes.object,
});

/**
 *
 * Label schema
 */
export const LabelSchema = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    color: PropTypes.string,
});

/**
 * Member schema
 */
export const MemberSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string,
  avatarUrl: PropTypes.string,
  initials: PropTypes.string,
  email: PropTypes.string,
  bio: PropTypes.string,
  url: PropTypes.string,
});