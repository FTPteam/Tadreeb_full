from rest_framework.permissions import BasePermission

from .models import User


class HasRole(BasePermission):
    """FR-04: allow only users whose role is in `roles`. Subclass and set roles."""

    roles = ()

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in self.roles)


class IsStudent(HasRole):
    roles = (User.Role.STUDENT,)


class IsSupervisor(HasRole):
    roles = (User.Role.SUPERVISOR,)


class IsProvider(HasRole):
    roles = (User.Role.PROVIDER,)


class IsCoordinator(HasRole):
    roles = (User.Role.COORDINATOR, User.Role.ADMIN)


class IsSystemAdmin(HasRole):
    roles = (User.Role.ADMIN,)


class IsStaffRole(HasRole):
    """Supervisor, coordinator or admin: the people who manage students."""

    roles = (User.Role.SUPERVISOR, User.Role.COORDINATOR, User.Role.ADMIN)
