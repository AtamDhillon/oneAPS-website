using AutoMapper;
using Dta.OneAps.Api.Business.Exceptions;
using Dta.OneAps.Api.Business.Models;
using Dta.OneAps.Api.Business.Utils;
using Dta.OneAps.Api.Services;
using Dta.OneAps.Api.Services.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Dta.OneAps.Api.Business {
    public class OpportunityBusiness : IOpportunityBusiness {
        private readonly IEncryptionUtil _encryptionUtil;
        private readonly IOpportunityService _opportunityService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private IConfiguration _config;

        public OpportunityBusiness(IConfiguration config, IEncryptionUtil encryptionUtil, IOpportunityService opportunityService, IUserService userService, IMapper mapper) {
            _config = config;
            _opportunityService = opportunityService;
            _userService = userService;
            _mapper = mapper;
            _encryptionUtil = encryptionUtil;
        }

        public async Task<OpportunityPublicResponse> Create(OpportunitySaveRequest model, UserResponse creatorUser) {
            var toSave = _mapper.Map<Opportunity>(model);
            var user = await _userService.GetByIdAsync(creatorUser.Id);
            var saved = await _opportunityService.Create(toSave, user);
            var result = _mapper.Map<OpportunityPublicResponse>(saved);
            return result;
        }

        public async Task<OpportunityPublicResponse> Update(OpportunitySaveRequest model, UserResponse modiferUser) {
            var existing = await _opportunityService.GetByIdAsync(model.Id);
            var user = await _userService.GetByIdAsync(modiferUser.Id);
            var toSave = _mapper.Map(model, existing);
            var saved = await _opportunityService.Update(toSave, user);
            var result = _mapper.Map<OpportunityPublicResponse>(saved);
            return result;
        }
        public async Task<IEnumerable<OpportunityPublicResponse>> List() => (
            _mapper.Map<IEnumerable<OpportunityPublicResponse>>(await _opportunityService.GetAllAsync())
        );
        public async Task<IEnumerable<OpportunityAdminResponse>> ListAll() => _mapper.Map<IEnumerable<OpportunityAdminResponse>>(await _opportunityService.GetAllAsync());
        public async Task<OpportunityPublicResponse> Get(int id) => _mapper.Map<OpportunityPublicResponse>(await _opportunityService.GetByIdAsync(id));
    }
}
