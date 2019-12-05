package com.example.mypolicy;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.example.mypolicy.model.Policy;
import com.example.mypolicy.model.Referral;
import com.example.mypolicy.service.IApiService;
import com.example.mypolicy.service.RestClient;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;

import es.dmoral.toasty.Toasty;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GuideFragment extends Fragment {

    private int bgRes;
    private Referral referral;
    private ImageView imageView;
    private TextView textView;
    final IApiService iApiService=new RestClient("http://49.236.136.213:3000/").getApiService();
    final HashMap<String,Object> clickMap=new HashMap<>();


    SharedPreferences sharedPreferences;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //bgRes = getArguments().getInt("data");
        referral = (Referral) getArguments().get("data");
//        name=getArguments().getString("data");



    }
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_guide, container, false);

    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


        //imageView = (ImageView) getView().findViewById(R.id.image);
        //imageView.setBackgroundResource(bgRes);

        textView=getView().findViewById(R.id.tv_policy_name_test);
        textView.setText(referral.getTitle());
        Log.d("프래그먼트 ","피코드"+referral.getP_code());
        final Call<ArrayList<Policy>> call=iApiService.showselectedPolicy(R.id.tv_policy_pcode_test);
        final Call<ArrayList<Policy>> detail_call=iApiService.showselectedPolicy(referral.getP_code());
//        Log.d("체코드",""+GuideFragment.this.getActivity().getSharedPreferences("userEmail", Context.MODE_PRIVATE));
//        clickMap.put("uID",share);
        clickMap.put("p_code",referral.getP_code());

//        final Call<JsonObject> clickCall=iApiService.clickPolicy()



        /*******************화면을 눌렀을때 상세정책으로 들어가는 부분************************************/
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(view.getContext(),DetailPolicyActivity.class);
                intent.putExtra("position",referral.getP_code());
                startActivity(intent);
            }
        });

    }
}
